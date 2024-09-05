import React from 'react';

const ProductWriteSidebar = ({ sections, activeSection, onSectionClick }) => {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-4">프로젝트 관리</h2>
      <ul>
        {sections.map((section) => (
          <li key={section.id} className="mb-2">
            <button
              onClick={() => onSectionClick(section.id)}
              className={`w-full text-left p-2 rounded ${
                activeSection === section.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductWriteSidebar;