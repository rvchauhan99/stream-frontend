import { useState } from 'react'
import { baseApi } from '@src/store/api/baseApi'

interface SystemConfig {
  siteName: string
  maintenanceMode: boolean
  emailSettings: {
    smtpServer: string
    smtpPort: number
    smtpUser: string
    senderEmail: string
  }
  securitySettings: {
    maxLoginAttempts: number
    sessionTimeout: number
    passwordPolicy: {
      minLength: number
      requireSpecialChar: boolean
      requireNumber: boolean
      requireUppercase: boolean
    }
  }
}

const systemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSystemConfig: builder.query<SystemConfig, void>({
      query: () => '/system/config',
    }),
    updateSystemConfig: builder.mutation<void, Partial<SystemConfig>>({
      query: (config) => ({
        url: '/system/config',
        method: 'PATCH',
        body: config,
      }),
    }),
  }),
})

export const { useGetSystemConfigQuery, useUpdateSystemConfigMutation } = systemApi

const SystemSettings = () => {
  const { data: config, isLoading } = useGetSystemConfigQuery()
  const [updateConfig] = useUpdateSystemConfigMutation()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<SystemConfig>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateConfig(formData).unwrap()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update system settings:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <button
          onClick={() => {
            if (isEditing) {
              setFormData({})
            } else {
              setFormData(config || {})
            }
            setIsEditing(!isEditing)
          }}
          className="px-4 py-2 bg-dark-6 text-white rounded-lg hover:bg-dark-8"
        >
          {isEditing ? 'Cancel' : 'Edit Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-grey-60 mb-1">Site Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.siteName || config?.siteName || ''}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full bg-dark-8 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-45"
                />
              ) : (
                <p className="text-white">{config?.siteName}</p>
              )}
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode ?? config?.maintenanceMode}
                  onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                  disabled={!isEditing}
                  className="form-checkbox bg-dark-8 border-dark-10 text-red-45 rounded"
                />
                <span className="text-sm text-grey-60">Maintenance Mode</span>
              </label>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Email Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-grey-60 mb-1">SMTP Server</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emailSettings?.smtpServer || config?.emailSettings.smtpServer || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, smtpServer: e.target.value }
                  })}
                  className="w-full bg-dark-8 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-45"
                />
              ) : (
                <p className="text-white">{config?.emailSettings.smtpServer}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-grey-60 mb-1">SMTP Port</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.emailSettings?.smtpPort || config?.emailSettings.smtpPort || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, smtpPort: parseInt(e.target.value) }
                  })}
                  className="w-full bg-dark-8 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-45"
                />
              ) : (
                <p className="text-white">{config?.emailSettings.smtpPort}</p>
              )}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-grey-60 mb-1">Max Login Attempts</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.securitySettings?.maxLoginAttempts || config?.securitySettings.maxLoginAttempts || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    securitySettings: { ...formData.securitySettings, maxLoginAttempts: parseInt(e.target.value) }
                  })}
                  className="w-full bg-dark-8 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-45"
                />
              ) : (
                <p className="text-white">{config?.securitySettings.maxLoginAttempts}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-grey-60 mb-1">Session Timeout (minutes)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.securitySettings?.sessionTimeout || config?.securitySettings.sessionTimeout || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    securitySettings: { ...formData.securitySettings, sessionTimeout: parseInt(e.target.value) }
                  })}
                  className="w-full bg-dark-8 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-45"
                />
              ) : (
                <p className="text-white">{config?.securitySettings.sessionTimeout}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-45 text-white rounded-lg hover:bg-red-60"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}

export default SystemSettings 