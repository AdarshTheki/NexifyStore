import { EllipsisVertical, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AddressCard() {
  const [data, setData] = useState<AddressType[]>([]);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(`/api/users/address`, { method: 'GET' });
        const address = await res.json();
        setData(address);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddress();
  }, []);

  if (edit) return <DataForm close={() => setEdit(false)} />;

  return (
    <>
      <button
        onClick={() => setEdit(true)}
        className='text-body-medium hover:bg-gray-300 p-4 border rounded-lg flex items-center justify-between'>
        Adding Address
        <Plus />
      </button>
      {loading && <h2 className='text-center py-5'>Address Loading...</h2>}
      {data.length && data?.map((item) => <Card {...item} key={item._id} />)}
    </>
  );
}

function Card({ ...data }: AddressType) {
  const [edit, setEdit] = useState(false);

  const handleDeleted = async () => {
    try {
      const response = await fetch(`/api/users/address/${data._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      toast.success('Address will be deleted');
    } catch (error) {
      console.log(error);
      toast.error('something wrong');
    }
  };

  if (edit) return <DataForm rest={data} close={() => setEdit(false)} />;

  return (
    <div className='p-4 border capitalize rounded-lg relative'>
      <p className='font-bold'>Name: {data.name.toLocaleLowerCase() || 'NA'}</p>
      <p>phone: {data.phone.toLocaleLowerCase() || '#NA'}</p>
      <p>address: {data.address?.toLocaleLowerCase() || '#NA'}</p>
      <p>locality: {data.locality?.toLocaleLowerCase() || '#NA'}</p>
      <p>landmark: {data.landmark?.toLocaleLowerCase() || '#NA'}</p>
      <p>city: {data.city?.toLocaleLowerCase() || '#NA'}</p>
      <p>postalCode: {data.postalCode || '#NA'}</p>
      <div className='absolute right-2 top-2 cursor-pointer z-20'>
        <div className='relative group'>
          <EllipsisVertical fill='#fff' color='#000' />
          <div className='absolute hidden group-hover:block right-0 transform w-fit bg-white border border-gray-300 rounded-lg shadow-lg'>
            <button onClick={handleDeleted} className='w-full px-5 py-2 hover:bg-gray-300'>
              Delete
            </button>
            <button onClick={() => setEdit(true)} className='w-full px-5 py-2 hover:bg-gray-300'>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DataFormProps {
  rest?: AddressType;
  close: () => void;
}

const DataForm = ({ rest, close }: DataFormProps) => {
  const [data, setData] = React.useState({
    name: rest?.name || '',
    phone: rest?.phone || '',
    postalCode: rest?.postalCode || '',
    locality: rest?.locality || '',
    address: rest?.address || '',
    addressType: rest?.addressType || 'home',
    city: rest?.city || '',
    landmark: rest?.landmark || '',
    alternatePhone: rest?.alternatePhone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!rest?._id) {
        const response = await fetch('/api/users/address', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        toast.success('Address will be added');
      } else {
        const response = await fetch(`/api/users/address/${rest._id}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        toast.success('Address will be added');
      }
      setLoading(false);
      close();
    } catch (error: any) {
      console.error(error);
      toast.error(`something wrong ${error?.message}`);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/20 z-20 flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='space-y-3 sm:p-10 p-5 border rounded-xl max-w-[90dvw] max-h-[90dvh] h-fit overflow-y-auto bg-white'>
        <h2 className='text-heading3-bold mb-4'>Address Form</h2>
        <div className='grid sm:grid-cols-2 gap-4'>
          <label className='capitalize'>
            Full Name:
            <input
              type='text'
              name='name'
              className='border w-full py-2 px-5 rounded-lg'
              value={data.name}
              onChange={handleChange}
            />
          </label>
          <label className='capitalize'>
            phone:
            <input
              type='text'
              name='phone'
              className='border w-full py-2 px-5 rounded-lg'
              value={data.phone}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className='grid sm:grid-cols-2 gap-4'>
          <label className='capitalize'>
            address:
            <input
              type='text'
              name='address'
              className='border w-full py-2 px-5 rounded-lg'
              value={data.address}
              onChange={handleChange}
            />
          </label>
          <label className='capitalize'>
            locality:
            <input
              type='text'
              name='locality'
              className='border w-full py-2 px-5 rounded-lg'
              value={data.locality}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className='grid sm:grid-cols-2 gap-4'>
          <label className='capitalize'>
            city:
            <input
              type='text'
              name='city'
              className='border w-full py-2 px-5 rounded-lg'
              value={data.city}
              onChange={handleChange}
            />
          </label>
          <label className='capitalize'>
            postalCode:
            <input
              type='number'
              name='postalCode'
              className='border w-full py-2 px-5 rounded-lg'
              value={data.postalCode}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className='grid sm:grid-cols-2 gap-4'>
          <label className='capitalize'>
            landmark:
            <input
              type='text'
              name='landmark'
              className='border w-full py-2 px-5 rounded-lg'
              value={data.landmark}
              onChange={handleChange}
            />
          </label>
          <label className='capitalize'>
            alternatePhone:
            <input
              type='text'
              name='alternatePhone'
              className='border w-full py-2 px-5 rounded-lg'
              value={data.alternatePhone}
              onChange={handleChange}
            />
          </label>
        </div>
        <button
          type='submit'
          className='bg-grey-1 border border-grey-1 hover:opacity-80 text-white py-2 px-6 rounded-lg'>
          {loading ? 'Loading...' : 'Submit'}
        </button>
        <button
          onClick={close}
          type='button'
          className='ml-5 border-grey-1 hover:opacity-80 border py-2 px-6 rounded-lg'>
          Close
        </button>
      </form>
    </div>
  );
};
