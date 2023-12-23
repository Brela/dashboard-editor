import { faLongArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const CSVModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/50">
      <div className="bg-zinc-50 p-6 rounded-lg drop-shadow-xl text-black/80 w-80">
        <h3 className="font-bold mb-4 text-lg">How to upload product CSV file</h3>
        <div className="mb-4">
          <ul className="list-disc pl-5 space-y-3">
            <li>
              Download or make a copy of the following Google spreadsheet: <a href="https://docs.google.com/spreadsheets/d/11zLdc7QNXyBjnA-qKAbet-_KD8ODlS14SRF0b8n4HEw/edit?usp=sharing" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">
                Orderly Product Inventory List
              </a>
            </li>
            <li className=''>
              Add your products to spreadsheet. You can use the following example for reference: <a href="https://docs.google.com/spreadsheets/d/1JuiVfSlx31bWeiF6UiBeKYsL56ll1NAX7EDUStwrAww/edit?usp=sharing" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">
                Orderly Product Inventory List - Example
              </a>
            </li>
            <li>Download your spreadsheet as a Comma Separated Values (.csv)</li>
          </ul>
        </div>
        <button className="bg-emerald-400/80 hover:bg-emerald-400 text-emerald-800 px-4 py-2 rounded-lg w-full" onClick={onClose}>
         Continue <FontAwesomeIcon icon={faLongArrowRight} className='ml-1' />
        </button>
      </div>
    </div>
  );
}

export default CSVModal;
