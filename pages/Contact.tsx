import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ContactInfo } from '../types';
import { Mail, Github, Twitter, UserCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  const contacts: ContactInfo[] = [
    { name: 'Mr. Wang', roleKey: 'contact.role.teacher', email: 'wang@school.edu' },
    { name: 'Alice Chen', roleKey: 'contact.role.monitor', email: 'alice.c@example.com', social: '@alice' },
    { name: 'Bob Smith', roleKey: 'contact.role.org', email: 'bob.party@example.com' },
  ];

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">{t('contact.title')}</h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contacts.map((contact, index) => (
            <div key={index} className="flex flex-col items-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-sm mb-4 group-hover:scale-105 transition-transform">
                 <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <UserCircle size={64} strokeWidth={1} />
                 </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">{contact.name}</h3>
              <span className="text-primary text-sm font-medium uppercase tracking-wide mb-4">
                {t(contact.roleKey)}
              </span>
              
              <div className="space-y-2 w-full">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center justify-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm bg-white py-2 rounded border border-gray-200">
                    <Mail size={14} /> {contact.email}
                  </a>
                )}
                {contact.social && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm bg-white py-2 rounded border border-gray-200">
                    <Twitter size={14} /> {contact.social}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;