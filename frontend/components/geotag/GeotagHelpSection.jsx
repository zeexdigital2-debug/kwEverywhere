'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Upload, MapPin, Tag, FileCheck, Download } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Upload Your Image',
    desc: 'Select or drag-and-drop your JPEG, PNG, or WebP pictures. Existing EXIF coordinates are automatically detected.',
    icon: Upload,
  },
  {
    step: '02',
    title: 'Pin Location on Map',
    desc: 'Click on the interactive map, drag the GPS marker, or search any city or address with the instant geocoder.',
    icon: MapPin,
  },
  {
    step: '03',
    title: 'Add SEO Keywords & Alt Text',
    desc: 'Input targeted local SEO keywords, business descriptions, and document titles into standard EXIF/IPTC metadata tags.',
    icon: Tag,
  },
  {
    step: '04',
    title: 'Write EXIF Geotags',
    desc: 'Click "Write EXIF Tags" to inject GPS latitude, longitude, and metadata directly into the image header in your browser.',
    icon: FileCheck,
  },
  {
    step: '05',
    title: 'Download Geotagged Photo',
    desc: 'Download the modified high-resolution JPEG immediately, or export all uploaded photos together as a single ZIP archive.',
    icon: Download,
  },
];

const faqs = [
  {
    q: 'What is photo geotagging and how does it help Local SEO?',
    a: 'Photo geotagging is the process of embedding geographical identification metadata—such as latitude and longitude coordinates—directly into an image file’s EXIF header. For local businesses and SEO practitioners, uploading geotagged images to Google Business Profile (formerly GMB), websites, and social media reinforces the geographical relevance of your brand, establishing stronger local citation signals for nearby search queries.'
  },
  {
    q: 'Why is JPEG the recommended format for geotagging photos?',
    a: 'The EXIF (Exchangeable Image File Format) standard is natively designed for JPEG files and supported across virtually all operating systems (Windows, macOS, Linux, Android, iOS) and photo software. While formats like PNG or WebP support custom metadata chunks, many photo viewers and online platforms only parse GPS coordinates from JPEG EXIF headers. Our tool automatically converts uploaded PNG or WebP files to high-quality JPEG so your geotags remain universally readable.'
  },
  {
    q: 'How do I verify the written geotag and GPS data on my computer?',
    a: 'On Windows, right-click the downloaded image file, select Properties, and navigate to the Details tab. Scroll down to the GPS section to view Latitude and Longitude, and check the Description section for your Title, Comments, and Keywords. On macOS, open the image in Preview, press Command + I (Show Inspector), and click the GPS tab (represented by a compass icon) to see the pinned map location.'
  },
  {
    q: 'Does Google strip EXIF geotag metadata from photos?',
    a: 'When images are displayed publicly on websites or compressed for web serving, content delivery networks (CDNs) and platforms often strip metadata to reduce file weight. However, search engine crawlers and image processing algorithms read the raw uploaded file headers during indexing. Pinned coordinates and descriptive tags provide verifiable context when original media is ingested.'
  },
  {
    q: 'Are my photos or location data uploaded to your server?',
    a: 'No. All image processing, EXIF reading, GPS coordinate encoding, and JPEG compilation run 100% locally inside your web browser via client-side JavaScript. Your photos and personal location coordinates never leave your device and are never transmitted to any external server.'
  }
];

export default function GeotagHelpSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-8 pt-6">
      
      {/* How-to Steps */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Quick Tutorial
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            How to Geotag Photos Online in 5 Simple Steps
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Fast, free, and completely client-side in-browser photo metadata tagger.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-slate-400 font-mono">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs">
                    <item.icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Everything you need to know about photo geotags, EXIF coordinates, and Local SEO.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left group focus:outline-none"
                >
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed pr-6 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
