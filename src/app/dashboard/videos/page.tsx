'use client';

import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import ClientOnlySelect from '../../components/ClientOnlySelect';


import {
  // CloudArrowUpIcon,
  // CurrencyDollarIcon,
  // EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ClockIcon,
  TagIcon,
  FolderIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  QueueListIcon,
  LanguageIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  // XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  EyeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useUploadVideoMutation, useGetVideosQuery, useUploadExternalVideoMutation, useDeleteVideoMutation, useDeletethirdpartyVideoMutation } from '../../store/api/videoApi';
import { useGetGenericMasterByKeyQuery } from '../../store/api/commonApi';
import { log } from 'util';
import { getSocket } from '../../utils/socket';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  status: 'Processing' | 'Published' | 'Draft';
  views: number;
  revenue: number;
  uploadDate: string;
  monetization: 'Free' | 'Pay-per-view' | 'Subscription' | 'Ad-supported';
  description: string;
  tags: string;
  category: string;
  visibility: 'Private' | 'Public' | 'Unlisted';
  quality: string;
  hasCaption: boolean;
}

const WIZARD_STEPS = ['basic-info', 'settings', 'upload'] as const;
type UploadStep = typeof WIZARD_STEPS[number];

export default function VideoManagement() {
  const [page, setPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<UploadStep>('basic-info');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [selectedThumbNail, setSelectedThumbNail] = useState<File | null>(null);

  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const limit = 10;
  const { data: categoryList = [], isLoading: loadingCategories } = useGetGenericMasterByKeyQuery('category');
  const { data: taglist = [], isLoading: loadingTags } = useGetGenericMasterByKeyQuery('tag');
  const { data, isLoading, refetch } = useGetVideosQuery({ page, limit: 10 });

  const [externalPreviewFile, setExternalPreviewFile] = useState<File | null>(null);
  const handlePreviewDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log("Preview file selected:", file);
      setExternalPreviewFile(file);
    }
  }, []);
  const {
    getRootProps: getPreviewRootProps,
    getInputProps: getPreviewInputProps,
    isDragActive: isPreviewDragActive
  } = useDropzone({
    onDrop: handlePreviewDrop,
    accept: {
      'image/jpeg': ['.jpg']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB max size
  });

  const [socketId, setSocketId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  useEffect(() => {
    let socket: any = null;

    const initializeSocket = async () => {
      try {
        socket = getSocket();

        // Wait for connection
        if (!socket.connected) {
          await new Promise((resolve) => {
            socket.once('connect', resolve);
            socket.connect();
          });
        }

        setSocketId(socket.id);
        setIsSocketConnected(true);
        console.log("✅ Connected to backend socket server");
        console.log("Client Socket ID:", socket.id);

        // Event listeners
        socket.on("upload-progress", (data) => {
          console.log("📶 Progress event:", data);
          setUploadProgress(parseFloat(data.percentage));
        });

        socket.on("upload-complete", (data) => {
          console.log("✅ Complete event:", data);
          toast.success('Upload completed successfully!');
          setCurrentStep('completed');
          refetch();
        });

        socket.on("upload-error", (data) => {
          console.error("❌ Error event:", data);
          toast.error(data.error || 'Upload failed');
          setCurrentStep('error');
        });

      } catch (error) {
        console.error("Socket initialization error:", error);
        setIsSocketConnected(false);
        setSocketId(null);
      }
    };

    initializeSocket();

    // Cleanup
    return () => {
      if (socket) {
        socket.off("upload-progress");
        socket.off("upload-complete");
        socket.off("upload-error");
        socket.disconnect();
      }
    };
  }, []);

  const [videoData, setVideoData] = useState({
    videoType: '',
    title: '',
    videoUrl: '',
    description: '',
    tags: '',
    category: '',
    visibility: 'private',
    monetizationType: 'free',
    price: '0',
    targetQuality: '1080p',
    enableCaptions: false,
    isDRM: false,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [uploadVideo] = useUploadVideoMutation();
  const [uploadThirdPartyVideo] = useUploadExternalVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const [deleteThirdPartyVideo] = useDeletethirdpartyVideoMutation();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    try {
      if (videoData.videoType == 'internal') {
        if (!isSocketConnected || !socketId) {
          toast.error('Socket connection not established. Please try again.');
          return;
        }
      }

      setIsUploading(true);
      setIsProcessing(true);
      const formData = new FormData();

      if (videoData.videoType == 'external') {
        if (!externalPreviewFile && !selectedFile) {
          toast.error('Need to select Preview or Thumbnail , You can also select both');
          setIsUploading(false);
          setIsProcessing(false);
          return;
        }
        formData.append('thumbnail', externalPreviewFile);
        formData.append('filepath', videoData.videoUrl);
        formData.append('preview', selectedFile);
      } else {
        if (!selectedFile) {
          toast.error('Please select a video to upload');
          setIsUploading(false);
          setIsProcessing(false);
          return;
        }
        formData.append('video', selectedFile);
      }
      formData.append('title', videoData.title);
      formData.append('description', videoData.description);
      formData.append('tags', JSON.stringify(videoData.tags.split(',').map(t => t.trim())));
      formData.append('category', videoData.category);
      formData.append('visibility', videoData.visibility.toLowerCase());
      formData.append('drmEnabled', String(videoData.isDRM));
      formData.append('quality', videoData.targetQuality);
      formData.append('type', videoData.monetizationType.toLowerCase());
      formData.append('price', videoData.price);
      formData.append('currency', 'INR');
      formData.append('enableCaptions', String(videoData.enableCaptions));
      formData.append('socketId', socketId);
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      if (videoData.videoType === 'external') {
        console.log("Uploading external video");
        console.log("formData", formData);
        const response = await uploadThirdPartyVideo(formData).unwrap();
        toast.success('Upload Successful');
        refetch();
        setCurrentStep('completed');
        if (response) {
          toast.success(`Video uploaded successfully: ${response.message || 'Success'}`);
        }
      } else {
        await uploadVideo(formData).unwrap();
        toast.success('Upload Started');
        setCurrentStep('uploading');
      }

    } catch (err: any) {
      toast.error(err?.data?.message || 'Upload failed');
      const errorObject = err?.data?.error || {};
      console.log("errorObject", errorObject);
      
      if(typeof errorObject === 'string'){
        toast.error(errorObject);
      }else{
        for (const [key, value] of Object.entries(errorObject)) {
          toast.error(value + "");
        }
      }
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  const handleDeleteVideo = async (data: any) => {

    console.log("Deleting video with ID:", data);
    const videoId = data.videoId;
    console.log('Deleting video with ID:', videoId);
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      setDeletingId(videoId);
      if (data.type === 'thirdparty') {
        await deleteThirdPartyVideo(videoId).unwrap();
      } else {
        await deleteVideo(videoId).unwrap();

      }
      toast.success('Video deleted successfully');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setVideoData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor('thumbnailPath', {
      header: 'Thumbnail',
      cell: info => <img src={info.getValue()} alt="thumbnail" className="w-20 h-12 object-cover rounded" />,
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor('category', { header: 'Category' }),
    columnHelper.accessor('type', { header: 'Type' }),
    columnHelper.accessor('monetization.type', {
      header: 'Monetization Type',
      cell: info => info.getValue()?.toUpperCase(),
    }),
    columnHelper.accessor('monetization.price', {
      header: 'Price',
      cell: info => `₹${info.getValue()}`,
    }),
    columnHelper.accessor('creatorId.name', {
      header: 'Creator',
      cell: info => info.getValue() || '—',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center space-x-2">
          {/* <button
            onClick={() => {
              const original = info.row.original;
              setEditingVideo(original);
              setVideoData({
                videoType: original.videoType === 'external' ? 'external' : 'internal',
                videoUrl: original.videoUrl,
                // thumbnailUrl: original.thumbnailPath,
                title: original.title,
                description: original.description,
                tags: original.tags,
                category: original.category,
                visibility: original.visibility,
                monetizationType: original.monetization,
                price: '0',
                targetQuality: original.quality,
                enableCaptions: original.hasCaption,
                isDRM: false,
              });
              setCurrentStep('basic-info');
              setShowUploadModal(true);
            }}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
            <ShareIcon className="h-5 w-5" />
          </button> */}
          <button
            onClick={() => handleDeleteVideo(info.row.original)} // or ._id
            className={`p-1 rounded-lg hover:bg-gray-800 ${deletingId === info.row.original.id ? 'cursor-not-allowed text-yellow-400' : 'text-gray-400 hover:text-red-500'
              }`}
            disabled={deletingId === info.row.original.videoId}
          >
            {/* {info.row.original.videoId} */}
            {deletingId === info.row.original.videoId ? (
              <svg className="animate-spin h-5 w-5 mx-auto text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              <TrashIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.videos || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Important: disable internal pagination
    pageCount: data?.totalPages || 1, // Optional if you want to keep track of total pages
  });

  const resetForm = () => {
    setVideoData({
      title: '',
      videoType: 'internal',
      videoUrl: '',
      description: '',
      tags: '',
      category: '',
      visibility: 'Private',
      monetizationType: 'Free',
      price: '0',
      targetQuality: '1080p',
      enableCaptions: false,
      isDRM: false,
    });
    setSelectedFile(null);
    setExternalPreviewFile(null);

    setUploadProgress(0);
    setCurrentStep('basic-info');
    // setEditingVideo(null);
  };
  const handleCloseModal = () => {
    setShowUploadModal(false);
    resetForm();
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {

      setSelectedFile(file);

    }
  }, []);



  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024 * 1024, // 8GB max file size
  });



  const handleNext = () => {
    switch (currentStep) {
      case 'basic-info':
        setCurrentStep('settings');
        break;
      case 'settings':
        setCurrentStep('upload');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'settings':
        setCurrentStep('basic-info');
        break;
      case 'upload':
        setCurrentStep('settings');
        break;
    }
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic-info':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-grey-70 mb-2">
                <div className="flex items-center space-x-2">
                  {/* <CurrencyDollarIcon className="h-4 w-4" /> */}
                  <span>Video Type</span>
                </div>
              </label>
              <select
                name="videoType"
                value={videoData.videoType}
                onChange={handleInputChange}
                className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
              >
                <option value="internal">Internal</option>
                <option value="external">External</option>
                {/* <option value="rent">Rent</option> */}
                {/* <option value="Ad-supported">Ad-supported</option> */}
              </select>
            </div>

            {(videoData.videoType === 'external') && (
              <div>
                <label className="block text-grey-70 mb-2">URL</label>
                <input
                  name="videoUrl"
                  value={videoData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  min="0"
                  step="0.01"
                />
              </div>
            )}


            <div>
              <label className="block text-grey-70 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={videoData.title}
                onChange={handleInputChange}
                className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                placeholder="Enter video title"
                required
              />
            </div>
            <div>
              <label className="block text-grey-70 mb-2">Description</label>
              <textarea
                name="description"
                value={videoData.description}
                onChange={handleInputChange}
                className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45 h-32"
                placeholder="Enter video description"
                required
              />
            </div>
            <div>
              <label className="block text-grey-70 mb-2">
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-4 w-4" />
                  <span>Tags</span>
                </div>
              </label>

              <ClientOnlySelect
                isMulti
                name="tags"
                className="react-select-container text-black" // `text-black` is necessary for react-select styles
                classNamePrefix="react-select"
                required
                isLoading={loadingTags}
                options={taglist.map((tag: { value: string }) => ({
                  label: tag.value,
                  value: tag.value
                }))}
                value={videoData.tags.split(',').filter(Boolean).map(tag => ({ label: tag, value: tag }))}
                onChange={(selected) => {
                  const tagValues = selected.map(item => item.value).join(',');
                  setVideoData(prev => ({ ...prev, tags: tagValues }));
                }}
                placeholder="Select tags"
              />

              {/* <Select
                isMulti
                name="tags"
                className="react-select-container text-black" // `text-black` is necessary for react-select styles
                classNamePrefix="react-select"
                isLoading={loadingTags}
                options={taglist.map((tag: { value: string }) => ({
                  label: tag.value,
                  value: tag.value
                }))}
                value={videoData.tags.split(',').filter(Boolean).map(tag => ({ label: tag, value: tag }))}
                onChange={(selected) => {
                  const tagValues = selected.map(item => item.value).join(',');
                  setVideoData(prev => ({ ...prev, tags: tagValues }));
                }}
                placeholder="Select tags"
              /> */}
            </div>
            <div>
              <label className="block text-grey-70 mb-2">
                <div className="flex items-center space-x-2">
                  <FolderIcon className="h-4 w-4" />
                  <span>Category</span>
                </div>
              </label>
              <select
                name="category"
                value={videoData.category}
                onChange={handleInputChange}
                className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                required
              >
                <option value="">Select category</option>
                {loadingCategories ? (
                  <option disabled>Loading...</option>
                ) : (
                  categoryList.map((cat: { value: string }) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.value}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-grey-70 mb-2">
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-4 w-4" />
                  <span>Visibility</span>
                </div>
              </label>
              <select
                name="visibility"
                value={videoData.visibility}
                onChange={handleInputChange}
                className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="Unlisted">Unlisted</option>
              </select>
            </div>
            <div>
              <label className="block text-grey-70 mb-2">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>Monetization</span>
                </div>
              </label>
              <select
                name="monetizationType"
                value={videoData.monetizationType}
                onChange={handleInputChange}
                className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="rent">Rent</option>
                {/* <option value="Ad-supported">Ad-supported</option> */}
              </select>
            </div>
            {(videoData.monetizationType === 'paid' || videoData.monetizationType === 'rent') && (
              <div>
                <label className="block text-grey-70 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={videoData.price}
                  onChange={handleInputChange}
                  className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  min="0"
                  step="0.01"
                />
              </div>
            )}
            <div>
              <label className="flex items-center space-x-2 text-grey-70">
                <input
                  type="checkbox"
                  name="isDRM"
                  checked={videoData.isDRM}
                  onChange={handleInputChange}
                  className="form-checkbox bg-dark-10 border-grey-70 text-red-45 rounded"
                />
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Enable DRM Protection</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 text-grey-70">
                <input
                  type="checkbox"
                  name="enableCaptions"
                  checked={videoData.enableCaptions}
                  onChange={handleInputChange}
                  className="form-checkbox bg-dark-10 border-grey-70 text-red-45 rounded"
                />
                <ChatBubbleLeftIcon className="h-4 w-4" />
                <span>Auto-generate captions</span>
              </label>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="bg-dark-10 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Video Details Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-grey-70">Title</p>
                  <p className="text-white">{videoData.title}</p>
                </div>
                <div>
                  <p className="text-grey-70">Category</p>
                  <p className="text-white">{videoData.category}</p>
                </div>
                <div>
                  <p className="text-grey-70">Visibility</p>
                  <p className="text-white">{videoData.visibility}</p>
                </div>
                <div>
                  <p className="text-grey-70">Monetization</p>
                  <p className="text-white">{videoData.monetizationType}</p>
                </div>
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-grey-70 rounded-lg p-8 text-center cursor-pointer
                  ${isDragActive ? 'border-red-45 bg-red-45 bg-opacity-5' : ''}`}
            >
              <div>
                <input {...getInputProps()} />
                <CloudArrowUpIcon className="h-24 w-24 mx-auto text-grey-70 mb-4" />
                <p className="text-grey-70">
                  {videoData.videoType === 'external'
                    ? 'Drag & drop your preview video here, or click to select'
                    : 'Drag & drop your video here, or click to select'}
                </p>
                <p className="text-grey-60 text-sm mt-2">
                  Supported formats: MP4 (max 8GB)
                </p>
              </div>


            </div>
            <div>
              {videoData.videoType === 'external' && (
                <div
                  {...getPreviewRootProps()}
                  className={`border-2 border-dashed border-yellow-400 rounded-lg p-6 text-center cursor-pointer 
      ${isPreviewDragActive ? 'border-yellow-500 bg-yellow-900 bg-opacity-10' : ''}`}
                >
                  <input {...getPreviewInputProps()} />
                  <img
                    src="/icons/image-upload-placeholder.png" // replace this with your actual placeholder or remove it
                    alt="Thumbnail Icon"
                    className="h-16 w-16 mx-auto text-yellow-400 mb-2"
                  />
                  <p className="text-yellow-300">Drag & drop your preview image (.jpg) here, or click to select.</p>
                  <p className="text-yellow-400 text-sm mt-1">Only JPG format is supported (max 2MB)</p>
                  {externalPreviewFile && (
                    <p className="text-white mt-2 font-medium">Selected: {externalPreviewFile.name}</p>
                  )}
                </div>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-grey-70 text-sm mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-dark-15 rounded-full h-2">
                  <div
                    className="bg-red-45 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'processing':
        return (
          <div className="text-center py-8">
            <CheckCircleIcon className="text-green-500 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Upload Complete!</h3>
            <p className="text-grey-70 mb-4">Your video is now being processed. This may take a few minutes.</p>
            <button
              onClick={() => setShowUploadModal(false)}
              className="bg-red-45 text-white px-6 py-2 rounded-lg hover:bg-red-60"
            >
              Done
            </button>
          </div>

        );
      case 'uploading':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-white mb-2">Uploading...</h3>
            <p className="text-gray-400 mb-4">Please wait while your video is being uploaded.</p>

            <div className="w-3/4 mx-auto bg-gray-700 rounded-full h-4 overflow-hidden mb-4">
              <div
                className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>

            <p className="text-sm text-white">{uploadProgress}%</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-red-500 mb-2">Upload Failed</h3>
            <p className="text-gray-400 mb-4">There was an error uploading your video. Please try again.</p>
            <button
              onClick={() => setShowUploadModal(false)}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        );


      case 'completed':
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-green-500 mb-2">Upload Succeed</h3>
            <p className="text-gray-400 mb-4">Your video has been successfully uploaded.</p>
            <button
              onClick={() => setShowUploadModal(false)}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        );

    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Video Management</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          <span>Upload Video</span>
        </button>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-800">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={columns.length} className="text-center py-4 text-gray-400">Loading...</td></tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={data && data.videos.length < limit}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <span className="text-sm text-gray-400">
                Page {page}  of {table.getPageCount()}
              </span>

            </div>
          </div>

        </div>
      </div>
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingVideo ? 'Edit Video' : 'Upload New Video'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center mb-8">
              {WIZARD_STEPS.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === step
                      ? 'bg-red-500 text-white'
                      : WIZARD_STEPS.indexOf(currentStep as typeof WIZARD_STEPS[number]) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                      }`}
                  >
                    {WIZARD_STEPS.indexOf(currentStep as typeof WIZARD_STEPS[number]) > index ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < WIZARD_STEPS.length - 1 && (
                    <div
                      className={`w-20 h-1 mx-2 ${WIZARD_STEPS.indexOf(currentStep as typeof WIZARD_STEPS[number]) > index
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            {renderStepContent()}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              {currentStep !== 'basic-info' && currentStep !== 'processing' && (
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Back</span>
                </button>
              )}
              {currentStep !== 'processing' && (
                <button
                  onClick={currentStep === 'upload' ? handleUpload : handleNext}
                  disabled={isProcessing || isUploading}
                  className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg ml-auto ${
                    isProcessing || isUploading 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentStep === 'upload' ? 'Upload' : 'Next'}</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
