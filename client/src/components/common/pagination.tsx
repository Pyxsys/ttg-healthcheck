// 3rd Party
import React from 'react';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';

const Pagination = ({page, totalPages, onPageChanged}: {page: number, totalPages: number, onPageChanged: (page: number)=>void}) => {
  const range = [-1, 0, 1];
  return (
    <div className='d-flex justify-content-center'>
      <button className='btn' disabled={page === 1} style={{borderRadius: 0}}
        onClick={() => onPageChanged(page - 1)}
      >
        <FaChevronLeft color={page > 1 ? 'white' : 'gray'} />
      </button>

      {page + range[0] > 1 ?
        <div>
          <button className='btn' style={{borderRadius: 0}} onClick={() => onPageChanged(1)}>
            <span className='lead text-white'>{1}</span>
          </button>
          {page + range[0] - 1 > 1 ?
            <span className='px-1 user-select-none text-white'>...</span> :
            <></>
          }
        </div> :
        <></>
      }

      {range.map((index) => (
        index === 0 || (index < 0 && page + index >= 1) || (index > 0 && page + index <= totalPages) ?
          <button key={`pagination_${page + index}`} className='btn' disabled={index === 0} style={{borderRadius: 0}}
            onClick={() => onPageChanged(page + index)}
          >
            <span className={`lead ${index === 0 ? 'text-muted' : 'text-white'}`}>{page + index}</span>
          </button> :
          <div key={`pagination_${page + index}`} ></div>
      ))}

      {page + range[range.length-1] < totalPages ?
        <div>
          {page + range[range.length-1] + 1 < totalPages ?
            <span className='px-1 user-select-none text-white'>...</span> :
            <></>
          }
          <button className='btn' style={{borderRadius: 0}} onClick={() => onPageChanged(totalPages)}>
            <span className='lead text-white'>{totalPages}</span>
          </button>
        </div> :
        <></>
      }

      <button className='btn' disabled={page === totalPages}
        onClick={() => onPageChanged(page + 1)}>
        <FaChevronRight color={page < totalPages ? 'white' : 'gray'} />
      </button>
    </div>
  );
};

export default Pagination;
