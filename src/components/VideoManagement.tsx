import { useState, useCallback, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import QualityIcon from '@mui/icons-material/HighQuality';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

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

const mockVideos: Video[] = [
  {
    id: 1,
    title: 'Getting Started with Crypto Trading',
    thumbnail: 'https://via.placeholder.com/160x90',
    status: 'Published',
    views: 1234,
    revenue: 299.99,
    uploadDate: '2024-02-20',
    monetization: 'Pay-per-view',
    description: 'Learn the basics of crypto trading',
    tags: 'crypto,trading,beginner',
    category: 'education',
    visibility: 'Public',
    quality: '1080p',
    hasCaption: true,
  },
  {
    id: 2,
    title: 'Blockchain Fundamentals',
    thumbnail: 'https://via.placeholder.com/160x90',
    status: 'Processing',
    views: 0,
    revenue: 0,
    uploadDate: '2024-02-21',
    monetization: 'Subscription',
    description: 'Understanding blockchain technology',
    tags: 'blockchain,crypto,technology',
    category: 'education',
    visibility: 'Private',
    quality: '1080p',
    hasCaption: false,
  },
];

type UploadStep = 'basic-info' | 'settings' | 'upload' | 'processing';
const WIZARD_STEPS = ['basic-info', 'settings', 'upload'] as const;

export default function VideoManagement() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<UploadStep>('basic-info');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videoData, setVideoData] = useState({
    title: '',
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

  const resetForm = () => {
    setVideoData({
      title: '',
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
    setUploadProgress(0);
    setCurrentStep('basic-info');
    setEditingVideo(null);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    resetForm();
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setVideoData({
      title: video.title,
      description: video.description,
      tags: video.tags,
      category: video.category,
      visibility: video.visibility,
      monetizationType: video.monetization,
      price: '0',
      targetQuality: video.quality,
      enableCaptions: video.hasCaption,
      isDRM: false,
    });
    setCurrentStep('basic-info');
    setShowUploadModal(true);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      // Start upload simulation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setCurrentStep('processing');
        }
      }, 500);
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

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

  const renderStepIndicator = () => {
    const currentIndex = WIZARD_STEPS.indexOf(currentStep as typeof WIZARD_STEPS[number]);

    return (
      <div className="flex items-center justify-center mb-6">
        {WIZARD_STEPS.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentIndex ? 'bg-red-45 text-white' : 'bg-dark-15 text-grey-70'
            }`}>
              {index + 1}
            </div>
            {index < WIZARD_STEPS.length - 1 && (
              <div className={`w-16 h-1 ${
                index < currentIndex ? 'bg-red-45' : 'bg-dark-15'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic-info':
        return (
          <div className="space-y-6">
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
                  <LocalOfferIcon sx={{ fontSize: 18 }} />
                  <span>Tags</span>
                </div>
              </label>
              <input
                type="text"
                name="tags"
                value={videoData.tags}
                onChange={handleInputChange}
                className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                placeholder="Enter tags (comma separated)"
              />
            </div>
            <div>
              <label className="block text-grey-70 mb-2">
                <div className="flex items-center space-x-2">
                  <CategoryIcon sx={{ fontSize: 18 }} />
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
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="gaming">Gaming</option>
                <option value="music">Music</option>
                <option value="tech">Technology</option>
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
                  <PublicIcon sx={{ fontSize: 18 }} />
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
                  <MonetizationOnIcon sx={{ fontSize: 18 }} />
                  <span>Monetization</span>
                </div>
              </label>
              <select
                name="monetizationType"
                value={videoData.monetizationType}
                onChange={handleInputChange}
                className="w-full bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
              >
                <option value="Free">Free</option>
                <option value="Pay-per-view">Pay-per-view</option>
                <option value="Subscription">Subscription Only</option>
                <option value="Ad-supported">Ad-supported</option>
              </select>
            </div>
            {videoData.monetizationType === 'Pay-per-view' && (
              <div>
                <label className="block text-grey-70 mb-2">Price ($)</label>
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
                <SecurityIcon sx={{ fontSize: 18 }} />
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
                <ClosedCaptionIcon sx={{ fontSize: 18 }} />
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
              <input {...getInputProps()} />
              <CloudUploadIcon className="text-6xl text-grey-70 mb-4" />
              <p className="text-grey-70">
                Drag & drop your video here, or click to select
              </p>
              <p className="text-grey-60 text-sm mt-2">
                Supported formats: MP4, MOV, AVI, MKV, WebM (max 8GB)
              </p>
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
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'thumbnail',
      headerName: 'Thumbnail',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <img src={params.value} alt={params.row.title} className="w-20 h-12 object-cover rounded" />
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <span className={`px-3 py-1 rounded-md text-xs ${
          params.value === 'Published' ? 'bg-green-900 text-green-300' :
          params.value === 'Processing' ? 'bg-blue-900 text-blue-300' :
          'bg-yellow-900 text-yellow-300'
        }`}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'views',
      headerName: 'Views',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center space-x-1">
          <VisibilityIcon className="text-grey-70" sx={{ fontSize: 16 }} />
          <span>{params.value.toLocaleString()}</span>
        </div>
      ),
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center space-x-1">
          <MonetizationOnIcon className="text-green-500" sx={{ fontSize: 16 }} />
          <span>${params.value.toFixed(2)}</span>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex space-x-2">
          <button 
            className="text-grey-70 hover:text-white" 
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEditVideo(params.row as Video);
            }}
          >
            <EditIcon fontSize="small" />
          </button>
          <button className="text-grey-70 hover:text-white" title="Share">
            <ShareIcon fontSize="small" />
          </button>
          <button className="text-grey-70 hover:text-white" title="Add to Playlist">
            <PlaylistAddIcon fontSize="small" />
          </button>
          <button className="text-grey-70 hover:text-white" title="Delete">
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Video Management</h1>
        <button
          onClick={() => {
            setShowUploadModal(true);
            resetForm();
          }}
          className="bg-red-45 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-60"
        >
          <CloudUploadIcon />
          <span>Upload Video</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-dark-8 rounded-lg p-6 max-w-4xl w-full my-8">
            <div className="max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingVideo ? 'Edit Video' : 'Upload Video'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-grey-70 hover:text-white p-1"
                >
                  <CloseIcon />
                </button>
              </div>

              {currentStep !== 'processing' && renderStepIndicator()}
              
              <div className="mb-6">
                {renderStepContent()}
              </div>

              {currentStep !== 'processing' && (
                <div className="flex justify-between mt-6 pt-4 border-t border-dark-15">
                  {currentStep !== 'basic-info' && (
                    <button
                      onClick={handleBack}
                      className="flex items-center space-x-2 px-4 py-2 text-grey-70 hover:text-white"
                    >
                      <ArrowBackIcon />
                      <span>Back</span>
                    </button>
                  )}
                  {WIZARD_STEPS.indexOf(currentStep as typeof WIZARD_STEPS[number]) < WIZARD_STEPS.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="flex items-center space-x-2 px-6 py-2 bg-red-45 text-white rounded-lg hover:bg-red-60 ml-auto"
                    >
                      <span>Next</span>
                      <ArrowForwardIcon />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="bg-dark-8 rounded-lg">
        <DataGrid
          rows={mockVideos}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
          className="border-none"
          sx={{
            border: 'none',
            '.MuiDataGrid-root': {
              border: 'none',
              backgroundColor: 'transparent',
            },
            '.MuiDataGrid-main': {
              backgroundColor: '#1A1A1A',
              border: 'none',
            },
            '.MuiDataGrid-cell': {
              borderColor: '#333',
              borderBottom: 'none',
              color: '#fff',
              overflow: 'visible !important',
              whiteSpace: 'normal',
              '&:focus': {
                outline: 'none',
              },
            },
            '.MuiDataGrid-row': {
              color: '#fff',
              borderBottom: '1px solid #333',
              '&:hover': {
                backgroundColor: '#262626',
              },
              '&:last-child': {
                borderBottom: 'none',
              },
            },
            '.MuiDataGrid-columnHeaders': {
              backgroundColor: '#1A1A1A',
              borderBottom: '2px solid #333',
              borderTop: 'none',
              color: '#999',
              '.MuiDataGrid-columnHeaderTitle': {
                color: '#999',
                fontWeight: '600',
              },
            },
            '.MuiDataGrid-footerContainer': {
              backgroundColor: '#1A1A1A',
              borderTop: '1px solid #333',
              border: 'none',
            },
            '.MuiTablePagination-root': {
              color: '#999',
            },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              color: '#999',
            },
            '.MuiTablePagination-select': {
              color: '#fff',
            },
            '.MuiCheckbox-root': {
              color: '#666',
              '&.Mui-checked': {
                color: '#E30000',
              },
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
          }}
        />
      </div>
    </div>
  );
} 