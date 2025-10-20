import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// import { 
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from 'firebase/storage';
// import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // const uploadImage = async () => {
  //   // service firebase.storage {
  //   //   match /b/{bucket}/o {
  //   //     match /{allPaths=**} {
  //   //       allow read;
  //   //       allow write: if
  //   //       request.resource.size < 2 * 1024 * 1024 &&
  //   //       request.resource.contentType.matches('image/.*')
  //   //     }
  //   //   }
  //   // }
  //   setImageFileUploading(true);
  //   setImageFileUploadError(null);

  //   const storage = getStorage(app);
  //   const fileName = new Date().getTime() + imageFile.name;
  //   const storageRef = ref(storage, fileName);
  //   const uploadTask = uploadBytesResumable(storageRef, imageFile);
  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

  //       setImageFileUploadProgress(progress.toFixed(0));
  //     },
  //     (error) => {
  //       setImageFileUploadError(
  //         'Could not upload image (File must be less than 2MB)'
  //       );
  //       setImageFileUploadProgress(null);
  //       setImageFile(null);
  //       setImageFileUrl(null);
  //       setImageFileUploading(false);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         setImageFileUrl(downloadURL);
  //         setFormData({ ...formData, profilePicture: downloadURL });
  //         setImageFileUploading(false);
  //       });
  //     }
  //   );
  // };

  // Cloudinary client-side upload (unsigned preset)
const uploadImage = async () => {
  if (!imageFile) return;

  // reset state
  setImageFileUploading(true);
  setImageFileUploadError(null);
  setImageFileUploadProgress(0);

  // validations (match your Firebase rules)
  const MAX = 2 * 1024 * 1024; // 2MB
  if (imageFile.size > MAX) {
    setImageFileUploadError('Could not upload image (File must be less than 2MB)');
    setImageFileUploading(false);
    return;
  }
  if (!imageFile.type.startsWith('image/')) {
    setImageFileUploadError('Only image files are allowed');
    setImageFileUploading(false);
    return;
  }

  // env vars: add these in your .env
  // VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
  // VITE_CLOUDINARY_UNSIGNED_PRESET=your_unsigned_preset
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // form data
  const data = new FormData();
  data.append('file', imageFile);
  data.append('upload_preset', unsignedPreset);
  data.append('folder', 'profiles'); // optional
  data.append('public_id', `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`);

  // use XHR to get progress events
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const progress = Math.round((e.loaded / e.total) * 100);
      setImageFileUploadProgress(progress);
    }
  };

  xhr.onerror = () => {
    setImageFileUploadError('Could not upload image (network error)');
    setImageFileUploadProgress(null);
    setImageFile(null);
    setImageFileUrl(null);
    setImageFileUploading(false);
  };

  xhr.onload = () => {
    try {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        const downloadURL = res.secure_url; // final CDN URL
        setImageFileUrl(downloadURL);
        setFormData({ ...formData, profilePicture: downloadURL });
        setImageFileUploading(false);
      } else {
        throw new Error(res.error?.message || 'Upload failed');
      }
    } catch (err) {
      setImageFileUploadError('Could not upload image');
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
    }
  };

  xhr.send(data);
};



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/signout`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button 
        type='submit' 
        gradientDuoTone='purpleToBlue' 
        outline 
        disabled={loading || imageFileUploading}>
          
          {loading ? 'Loading...' : 'Update'}
        </Button>
        { currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button 
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
              >
                Create a post
              </Button>
              </Link>
           )
        }
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignout} className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
