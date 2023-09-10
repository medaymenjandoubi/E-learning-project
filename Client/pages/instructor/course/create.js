import { useState,  useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import { Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {Button} from "antd";
import CourseCreateForm from "../../../components/forms/CourseCreateForm.js";
import Resizer from 'react-image-file-resizer'
import  {toast}  from "react-toastify";
import { useRouter } from "next/router";
const {Option} = Select;



const CourseCreate = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '9.99',
        uploading: false,
        paid: true,
        category: "",
        loading: false,
        imagePreview: ''
    })
    const [image,setImage] = useState({});
    const [preview,setPreview] = useState("");
    const [uploadButtonText,setUploadButtonText] = useState("Upload Image");
    //console.log('testpaid',values.paid)
    
    //router initialization
    const router = useRouter();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const {data} = await axios.post("/api/course", {
                ...values,image,
            });
            toast("Great now you can start adding lessons")
            router.push('/instructor')
        } catch (err) {
            toast(err.response.data);
        }
    }

    const handleImageRemove = async () => {
        //console.log("REMOVE IMAGE")
        try {
            setValues({...values, loading: true})
            const res =await axios.post("/api/course/remove-image", {image})
            setImage({})
            setPreview("")
            setUploadButtonText("Upload Image ")
            setValues({...values, loading: false})
        } catch (err) {
            console.log(err);
            setValues({...values, loading: false})
            toast("Image upload failed. Try later.")
        }
    }
    
    const handleImage = (e) => {
        let file = e.target.files[0]
        setPreview(window.URL.createObjectURL(file));
        setUploadButtonText(file.name);
        setValues({...values, loading: true})
        //resize the image using the react-image-file-resizer library 
        Resizer.imageFileResizer(file,720, 500, "JPEG", 100, 0, async (uri) => {
            try {
                let {data} = await axios.post('/api/course/upload-image',{
                    image: uri,
                });
                console.log("IMAGE UPLOADED",data)
                //set image in the state 
                setImage(data)
                setValues({...values, loading: false})
            } catch (err) {
                console.log(err)
                setValues({...values, loading: false })
                toast("Image upload failed. Try later.")
            }
        })
    }


    
    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">Create Course</h1>
            <div className="pt-3 pb-3">
                <CourseCreateForm 
                handleChange={handleChange} 
                handleImage={handleImage} 
                handleSubmit={handleSubmit} 
                values={values} 
                setValues={setValues}
                preview={preview}
                uploadButtonText={uploadButtonText}
                handleImageRemove={handleImageRemove}/>
            </div>
           {/*  <pre>{JSON.stringify(values,null,4)}</pre>
            <br />
            <pre>{JSON.stringify(image,null,4)}</pre> */}
            
        </InstructorRoute>
    );
}

export default CourseCreate;
