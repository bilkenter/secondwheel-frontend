import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            About Our Company
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            We're passionate about giving best car options to our customers
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To provide best car options to our customers
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To become the industry leader by ...
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ali Kaan Sahin',
                role: 'Co-Founder',
                image: '/team/placeholder.jpg'
              },
              {
                name: 'Menna',
                role: 'Co-Founder',
                image: '/team/placeholder.jpg'
              },
              {
                name: 'Maryam',
                role: 'Co-Founder',
                image: '/team/placeholder.jpg'
              },
              {
                name: 'Emirhan',
                role: 'Co-Founder',
                image: '/team/placeholder.jpg'
              },
              {
                name: 'seyma',
                role: 'Co-Founder',
                image: '/team/placeholder.jpg'
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 mb-4">
                  {/* Add actual images later */}
                </div>
                <h3 className="text-xl font-medium text-gray-900">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Innovation', description: 'Constantly pushing boundaries' },
              { title: 'Integrity', description: 'Honest and ethical practices' },
              { title: 'Excellence', description: 'Commitment to quality' },
              { title: 'Collaboration', description: 'Working together for success' }
            ].map((value, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
