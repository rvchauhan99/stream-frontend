import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

interface SettingsSection {
  id: string;
  title: string;
  icon: JSX.Element;
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

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
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
    { id: 'profile', title: 'Profile Settings', icon: <PersonIcon /> },
    { id: 'notifications', title: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'security', title: 'Security', icon: <SecurityIcon /> },
    { id: 'payment', title: 'Payment Settings', icon: <PaymentIcon /> },
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
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-24 h-24 bg-dark-15 rounded-full flex items-center justify-center text-3xl text-grey-70">
          {profileData.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{profileData.name}</h3>
          <p className="text-grey-70">Content Creator</p>
          <button className="mt-2 text-red-45 hover:text-red-60 flex items-center space-x-1">
            <EditIcon sx={{ fontSize: 16 }} />
            <span>Change Photo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-grey-70 mb-2">Full Name</label>
          <div className="flex items-center space-x-2">
            <PersonIcon className="text-grey-70" />
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
            <EmailIcon className="text-grey-70" />
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
            <PhoneIcon className="text-grey-70" />
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
            <LanguageIcon className="text-grey-70" />
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
          <DarkModeIcon className="text-grey-70" />
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
              <VpnKeyIcon className="text-grey-70" />
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
              <VerifiedUserIcon className="text-grey-70" />
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
      <div className="bg-dark-10 rounded-lg p-6">
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

      <div className="bg-dark-10 rounded-lg p-6">
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

      <div className="bg-dark-10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Bank Account Details</h3>
          <button className="text-red-45 hover:text-red-60">
            <EditIcon />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-grey-70">Account Name</span>
            <span className="text-white">{paymentSettings.bankAccount.accountName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-grey-70">Account Number</span>
            <span className="text-white">{paymentSettings.bankAccount.accountNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-grey-70">Bank Name</span>
            <span className="text-white">{paymentSettings.bankAccount.bankName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-grey-70">SWIFT Code</span>
            <span className="text-white">{paymentSettings.bankAccount.swiftCode}</span>
          </div>
        </div>
      </div>

      <div className="bg-dark-10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">UPI Details</h3>
          <button className="text-red-45 hover:text-red-60">
            <EditIcon />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-70">UPI ID</span>
          <span className="text-white">{paymentSettings.upiId}</span>
        </div>
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
    <div className="flex space-x-6">
      {/* Sidebar */}
      <div className="w-64 bg-dark-8 rounded-lg p-4 h-fit">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
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
      <div className="flex-1 bg-dark-8 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          {sections.find(s => s.id === activeSection)?.title}
        </h2>
        {renderContent()}
      </div>
    </div>
  );
} 