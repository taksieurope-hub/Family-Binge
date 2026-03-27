import React from 'react';
import { Smartphone, Tv, MonitorPlay, Usb, Download, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const DownloadSection = () => {
  const devices = [
    {
      id: 1,
      name: 'Mobile Version',
      description: 'For Android smartphones',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=400&fit=crop',
      downloadLink: 'https://github.com/taksieurope-hub/Family-Binge/raw/main/app-release.apk'
    },
    {
      id: 2,
      name: 'Android TV',
      description: 'For Smart TVs',
      icon: Tv,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=150&fit=crop',
      downloadLink: 'https://github.com/taksieurope-hub/Family-Binge/raw/main/app-release.apk'
    },
    {
      id: 3,
      name: 'TV Stick',
      description: 'For Fire Stick & more',
      icon: Usb,
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=150&fit=crop',
      downloadLink: 'https://github.com/taksieurope-hub/Family-Binge/raw/main/app-release.apk'
    },
    {
      id: 4,
      name: 'TV Box',
      description: 'For Android boxes',
      icon: MonitorPlay,
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=200&h=150&fit=crop',
      downloadLink: 'https://github.com/taksieurope-hub/Family-Binge/raw/main/app-release.apk'
    }
  ];

  const installSteps = [
    {
      step: 1,
      title: 'Download the Downloader App',
      description: 'Access the Play Store and download "Downloader by AFTVnews"',
      icon: '📲'
    },
    {
      step: 2,
      title: 'Enable Unknown Sources',
      description: 'Go to Settings > Security & Restrictions > Enable Apps from Unknown Sources',
      icon: '⚙️'
    },
    {
      step: 3,
      title: 'Enter the Code',
      description: 'Open Downloader and type 664118 to install the app',
      icon: '🔢'
    }
  ];

  return (
    <section id="download" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium mb-4">
            3 DAYS FREE TRIAL
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Download the App to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Enjoy 3 Days Free
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Compatible with Android smartphones, Smart TV, TV Box, TV Stick
          </p>
        </div>

        {/* Device Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {devices.map((device) => (
            <div
              key={device.id}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <device.icon className="w-8 h-8 text-white" />
              </div>

              {/* Info */}
              <h3 className="text-white font-semibold text-lg mb-1">{device.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{device.description}</p>

              {/* Download Button */}
              <a href={device.downloadLink} download><Button className="w-full bg-white/10 hover:bg-purple-600 text-white border-0 transition-colors"><Download className="w-4 h-4 mr-2" />Download</Button></a>
            </div>
          ))}
        </div>

        {/* Installation Guide */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              How to Install on Your TV Device?
            </h3>
            <p className="text-gray-400">Follow these simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {installSteps.map((step, index) => (
              <div
                key={step.step}
                className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-6 px-3 py-1 bg-purple-600 rounded-full text-white text-sm font-bold">
                  Step {step.step}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4 mt-2">{step.icon}</div>

                {/* Content */}
                <h4 className="text-white font-semibold text-lg mb-2">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.description}</p>

                {/* Connector */}
                {index < installSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-purple-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Downloader Code */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl px-8 py-4">
              <span className="text-gray-300">Downloader Code:</span>
              <span className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                664118
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Or use a USB flash drive to install the APK directly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;

