import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useRef} from 'react';
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from 'firebase/storage';
// import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

   const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

    }
  };

    // useEffect(() => {
    //   if (imageFile) {
    //     handleUploadImage();
    //   }
    // }, [imageFile]);

  const navigate = useNavigate();
  

  const handleUploadImage = async () => {
    console.log(imageFile);
    try {
      if (!imageFile) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      setImageFileUploading(true);
      setImageUploadProgress(0);

      //  validations (match your Firebase rules)
  const MAX = 10 * 1024 * 1024; // 10MB
  if (imageFile.size > MAX) {
    setImageUploadError('Could not upload image (File must be less than 10MB)');
    setImageFileUploading(false);
    return;
  }
  if (!imageFile.type.startsWith('image/')) {
    setImageUploadError('Only image files are allowed');
    setImageFileUploading(false);
    return;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  console.log(imageFile)
 const data = new FormData();
  data.append('file', imageFile);
  data.append('upload_preset', unsignedPreset);
  data.append('folder', 'posts'); // optional
  data.append('public_id', `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const progress = Math.round((e.loaded / e.total) * 100);
      setImageUploadProgress(progress);
    }
  };

     xhr.onerror = () => {
    setImageUploadError('Could not upload image (network error)');
    setImageFile(null);
    setImageUploadProgress(null);
    setImageFileUrl(null);
    setImageFileUploading(false);
  };

  xhr.onload = () => {
    try {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        const downloadURL = res.secure_url; // final CDN URL
        console.log(downloadURL);
        setImageFileUrl(downloadURL);
        setFormData({ ...formData, image: downloadURL });
        setImageFileUploading(false);
      } else {
        throw new Error(res.error?.message || 'Upload failed');
      }
    } catch (err) {
      setImageUploadError('Could not upload image');
      setImageFile(null);
      setImageFileUrl(null);
       setImageUploadProgress(null);
      setImageFileUploading(false);
    }
  };
    xhr.send(data);
  } catch (error) {
    setImageUploadError('Image upload failed');
    console.log(error);
  }


    //   const storage = getStorage(app);
    //   const fileName = new Date().getTime() + '-' + file.name;
    //   const storageRef = ref(storage, fileName);
    //   const uploadTask = uploadBytesResumable(storageRef, file);
    //   uploadTask.on(
    //     'state_changed',
    //     (snapshot) => {
    //       const progress =
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       setImageUploadProgress(progress.toFixed(0));
    //     },
    //     (error) => {
    //       setImageUploadError('Image upload failed');
    //       setImageUploadProgress(null);
    //     },
    //     () => {
    //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //         setImageUploadProgress(null);
    //         setImageUploadError(null);
    //         setFormData({ ...formData, image: downloadURL });
    //       });
    //     }
    //   );
    // } catch (error) {
    //   setImageUploadError('Image upload failed');
    //   setImageUploadProgress(null);
    //   console.log(error);
    // }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title of the post'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='Uncategorized'>Select a category</option>
            <option value='YouTube'>YouTube</option>
            <option value='Artificial Intelligence'>Artificial Intelligence</option>
            <option value='Lifestyle'>Lifestyle</option>
            {/* <option value='science'></option> */}
            <option value='Tips & Tricks'>Tips & Tricks</option>
            <option value='Health & Fitness'>Health & Fitness</option>
            <option value='Travel'>Travel</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}