'use client';

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  PencilIcon,
  BanknotesIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MoonIcon,
  CheckBadgeIcon,
  KeyIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  language: string;
  darkMode: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newEarnings: boolean;
  newComments: boolean;
  payoutConfirmations: boolean;
  marketingEmails: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  deviceHistory: boolean;
}

interface BankAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftCode: string;
}

interface PaymentSettings {
  defaultPaymentMethod: 'bank' | 'upi';
  autoPayoutThreshold: string;
  bankAccount: BankAccount;
  upiId: string;
}

const BankAccountSchema = Yup.object().shape({
  accountName: Yup.string().required('Account name is required'),
  accountNumber: Yup.string().required('Account number is required'),
  bankName: Yup.string().required('Bank name is required'),
  swiftCode: Yup.string().required('SWIFT code is required'),
});

const UPISchema = Yup.object().shape({
  upiId: Yup.string()
    .required('UPI ID is required')
    .matches(/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z._]{2,49}$/, 'Invalid UPI ID format'),
});

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingUPI, setIsEditingUPI] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    language: 'English',
    darkMode: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    newEarnings: true,
    newComments: true,
    payoutConfirmations: true,
    marketingEmails: false,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    deviceHistory: true,
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    defaultPaymentMethod: 'bank',
    autoPayoutThreshold: '1000',
    bankAccount: {
      accountName: 'John Doe',
      accountNumber: '****1234',
      bankName: 'Example Bank',
      swiftCode: 'EXBKUS12',
    },
    upiId: 'john@upi',
  });

  const sections: SettingsSection[] = [
    { id: 'profile', title: 'Profile Settings', icon: <UserIcon className="h-6 w-6 text-grey-70" /> },
    { id: 'notifications', title: 'Notifications', icon: <BellIcon className="h-6 w-6 text-grey-70" /> },
    { id: 'security', title: 'Security', icon: <ShieldCheckIcon className="h-6 w-6 text-grey-70" /> },
    { id: 'payment', title: 'Payment Settings', icon: <CreditCardIcon className="h-6 w-6 text-grey-70" /> },
  ];

  const handleProfileUpdate = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationUpdate = (field: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSecurityUpdate = (field: keyof SecuritySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePaymentUpdate = (field: keyof PaymentSettings, value: string) => {
    setPaymentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <div className="w-24 h-24 bg-dark-15 rounded-full flex items-center justify-center text-3xl text-grey-70 mx-auto sm:mx-0">
          {profileData.name.charAt(0)}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold text-white">{profileData.name}</h3>
          <p className="text-grey-70">Content Creator</p>
          <button className="mt-2 text-red-45 hover:text-red-60 flex items-center space-x-1 mx-auto sm:mx-0">
            <PencilIcon className="h-5 w-5" />
            <span>Change Photo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-grey-70 mb-2">Full Name</label>
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-grey-70" />
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleProfileUpdate('name', e.target.value)}
              className="flex-1 bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
            />
          </div>
        </div>

        <div>
          <label className="block text-grey-70 mb-2">Email</label>
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="h-5 w-5 text-grey-70" />
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileUpdate('email', e.target.value)}
              className="flex-1 bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
            />
          </div>
        </div>

        <div>
          <label className="block text-grey-70 mb-2">Phone</label>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="h-5 w-5 text-grey-70" />
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleProfileUpdate('phone', e.target.value)}
              className="flex-1 bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
            />
          </div>
        </div>

        <div>
          <label className="block text-grey-70 mb-2">Language</label>
          <div className="flex items-center space-x-2">
            <GlobeAltIcon className="h-5 w-5 text-grey-70" />
            <select
              value={profileData.language}
              onChange={(e) => handleProfileUpdate('language', e.target.value)}
              className="flex-1 bg-dark-10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-dark-15">
        <div className="flex items-center space-x-2">
          <MoonIcon className="h-5 w-5 text-grey-70" />
          <span className="text-white">Dark Mode</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={profileData.darkMode}
            onChange={(e) => handleProfileUpdate('darkMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-dark-15 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-red-45 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-45"></div>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-dark-10 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-grey-70">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationUpdate(key as keyof NotificationSettings)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-15 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-red-45 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-45"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-dark-10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
            <p className="text-grey-70 text-sm">Add an extra layer of security to your account</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securitySettings.twoFactorEnabled}
              onChange={() => handleSecurityUpdate('twoFactorEnabled')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-dark-15 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-red-45 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-45"></div>
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <KeyIcon className="h-5 w-5 text-grey-70" />
              <span className="text-grey-70">Login Alerts</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.loginAlerts}
                onChange={() => handleSecurityUpdate('loginAlerts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-15 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-red-45 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-45"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <CheckBadgeIcon className="h-5 w-5 text-grey-70" />
              <span className="text-grey-70">Device History</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.deviceHistory}
                onChange={() => handleSecurityUpdate('deviceHistory')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-15 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-red-45 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-45"></div>
            </label>
          </div>
        </div>

        <button className="mt-6 bg-dark-15 text-white px-4 py-2 rounded-lg hover:bg-dark-20">
          View Login History
        </button>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-dark-10 rounded-lg p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-4">Default Payment Method</h3>
        <select
          value={paymentSettings.defaultPaymentMethod}
          onChange={(e) => handlePaymentUpdate('defaultPaymentMethod', e.target.value)}
          className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
        >
          <option value="bank">Bank Transfer</option>
          <option value="upi">UPI</option>
        </select>
      </div>

      <div className="bg-dark-10 rounded-lg p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-4">Auto-Payout Threshold</h3>
        <div className="flex items-center space-x-2">
          <span className="text-grey-70">$</span>
          <input
            type="number"
            value={paymentSettings.autoPayoutThreshold}
            onChange={(e) => handlePaymentUpdate('autoPayoutThreshold', e.target.value)}
            className="flex-1 bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
            min="0"
            step="100"
          />
        </div>
        <p className="text-grey-70 text-sm mt-2">Automatic payout when balance exceeds this amount</p>
      </div>

      <div className="bg-dark-10 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Bank Account Details</h3>
          {!isEditingBank && (
            <button 
              onClick={() => setIsEditingBank(true)}
              className="text-red-45 hover:text-red-60 p-2 rounded-lg"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {isEditingBank ? (
          <Formik
            initialValues={paymentSettings.bankAccount}
            validationSchema={BankAccountSchema}
            onSubmit={(values, { setSubmitting }) => {
              setPaymentSettings(prev => ({
                ...prev,
                bankAccount: values
              }));
              setIsEditingBank(false);
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                {Object.keys(paymentSettings.bankAccount).map((key) => (
                  <div key={key} className="space-y-1">
                    <label className="text-sm text-grey-70">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <Field
                      name={key}
                      type="text"
                      className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                    />
                    {errors[key as keyof BankAccount] && touched[key as keyof BankAccount] ? (
                      <div className="text-red-500 text-sm">{errors[key as keyof BankAccount]}</div>
                    ) : null}
                  </div>
                ))}
                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-45 text-white px-4 py-2 rounded-lg hover:bg-red-60 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingBank(false)}
                    className="bg-dark-15 text-grey-70 px-4 py-2 rounded-lg hover:text-white flex items-center space-x-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="space-y-3">
            {Object.entries(paymentSettings.bankAccount).map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-grey-70">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-dark-10 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">UPI Details</h3>
          {!isEditingUPI && (
            <button 
              onClick={() => setIsEditingUPI(true)}
              className="text-red-45 hover:text-red-60 p-2 rounded-lg"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {isEditingUPI ? (
          <Formik
            initialValues={{ upiId: paymentSettings.upiId }}
            validationSchema={UPISchema}
            onSubmit={(values, { setSubmitting }) => {
              setPaymentSettings(prev => ({
                ...prev,
                upiId: values.upiId
              }));
              setIsEditingUPI(false);
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-grey-70">UPI ID</label>
                  <Field
                    name="upiId"
                    type="text"
                    className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  />
                  {errors.upiId && touched.upiId ? (
                    <div className="text-red-500 text-sm">{errors.upiId}</div>
                  ) : null}
                </div>
                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-45 text-white px-4 py-2 rounded-lg hover:bg-red-60 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingUPI(false)}
                    className="bg-dark-15 text-grey-70 px-4 py-2 rounded-lg hover:text-white flex items-center space-x-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-grey-70">UPI ID</span>
            <span className="text-white">{paymentSettings.upiId}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'payment':
        return renderPaymentSettings();
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center space-x-2 bg-dark-8 px-4 py-2 rounded-lg text-grey-70 hover:text-white"
        >
          <span>{sections.find(s => s.id === activeSection)?.title}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Sidebar */}
        <div className={`
          lg:w-64 bg-dark-8 rounded-lg overflow-hidden
          ${isMobileMenuOpen ? 'block' : 'hidden'} 
          lg:block lg:h-fit
          fixed lg:static top-[4rem] left-0 right-0 z-50
          lg:z-0 p-4
        `}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${
                activeSection === section.id
                  ? 'bg-red-45 text-white'
                  : 'text-grey-70 hover:bg-dark-15 hover:text-white'
              }`}
            >
              {section.icon}
              <span>{section.title}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-dark-8 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {sections.find(s => s.id === activeSection)?.title}
            </h2>
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
} 