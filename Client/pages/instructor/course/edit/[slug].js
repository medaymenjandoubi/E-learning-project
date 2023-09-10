import { useState,  useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {Button, List, Avatar,Modal} from "antd";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm.js"
import Resizer from 'react-image-file-resizer'
import  {toast}  from "react-toastify";
import { useRouter } from "next/router";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";
const {Item} = List;
const {Option} = Select;



const CourseEdit = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '9.99',
        uploading: false,
        paid: true,
        category: "",
        loading: false,
        imagePreview: '',
        lessons: [],
    })
    const [image,setImage] = useState({});
    const [preview,setPreview] = useState("");
    const [uploadButtonText,setUploadButtonText] = useState("Upload Image");
    //console.log('testpaid',values.paid)
    
    //router initialization
    const router = useRouter();
    const {slug} = router.query;
    //state for lesson update 
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState({});
    const [uploadVideoButtonText,setVideoUploadButtonText] = useState("Upload Video");
    const [progress,setProgress]=useState(0)
    const [uploading,setUploading] =useState(false)
    useEffect(()=> {
        loadCourse()
    },[slug])
    
    const loadCourse = async() => {
        const {data}= await axios.get(`/api/course/${slug}`)
        if (data) setValues(data)
        if (data && data.image) setImage(data.image);

    }
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            //setImage(values.image)
            console.log('testimagefront',image)
            e.preventDefault();
            const {data} = await axios.put(`/api/course/${slug}`, {
                ...values,image
            });
            toast("Course updated!")
            router.push('/instructor')
        } catch (err) {
            toast(err.response.data);
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
    const handleImageRemovee = async () => {
        //console.log("REMOVE IMAGE")
        try {
            setValues({...values, loading: true})
            const res =await axios.post("/api/course/remove-image", values)
            setImage({})
            setPreview("")
            values.image={}
            setUploadButtonText("Upload Image ")
            setValues({...values, loading: false})
        } catch (err) {
            console.log(err);
            setValues({...values, loading: false})
            toast("Image upload failed. Try later.")
        }
    }
    const handleDrag = (e, index) => {
        e.dataTransfer.setData("itemIndex", index);
    }
    const handleDrop = async(e,index) => {
        const movingItemIndex = e.dataTransfer.getData("itemIndex");
        const targetItemIndex = index;
        const allLessons = values.lessons; 

        let movingItem = allLessons[movingItemIndex];
        allLessons.splice(movingItemIndex,1) // removing the 1 item that corresponds with movingItemIndex
        allLessons.splice(targetItemIndex,0,movingItem) // pushing the moving item in the targetItemIndex

        setValues({...values, lessons: [...allLessons]})
        const {data} = await axios.put(`/api/course/${slug}`, {
            ...values,image
        });
        console.log("LESSONS rearranged res",data);
        toast("Lessons rearranged successfully")
    }
    const handleDelete=async (index)=> {
        const answer = window.confirm("Are you sure you want to delete this lesson")
        if (!answer) return;
        let allLessons = values.lessons;
        const removed = allLessons.splice(index, 1);
        //console.log(removed[0]._id)
        setValues({...values, lessons: [...allLessons]})
        
        const {data} = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
        console.log("Lesson deleted", data)
    }
    /**
     * lesson update functions
     */
    const handleVideo =async(e)=> {
        //console.log('showing current content',current)
        if (current.video && current.video.Location){
            const res = await axios.post(`/api/course/video-remove/${values.instructor._id}`,current.video)
            console.log('REMOVED ====>',res)
        }
        //upload
        const file = e.target.files[0]
        setUploadButtonText(file.name);
        setUploading(true);
        //send video as form data
        const videoData = new FormData()
        videoData.append('video', file)
        videoData.append("courseId", values._id);
        // save progress bar and send video as form data to backend
        const {data} = await axios.post(`/api/course/video-upload/${values.instructor._id}`, videoData, {
            onUploadProgress: (e)=> setProgress(Math.round((100*e.loaded)/e.total))
        })
        console.log(data)
        setCurrent({...current, video: data})
        setUploading(false)
    }
    const handleUpdateLesson= async(e)=> {
        //console.log("handle update lesson ")
        e.preventDefault()
        const {data} = await axios.put(`/api/course/lesson/${slug}/${current._id}`,current)
        setUploadButtonText("Upload Video")
        setVisible(false)
        

        //change ui content 
        if (data.ok) {
            const arr = values.lessons;
            const index = arr.findIndex((el)=>el._id === current._id);
            arr[index]= current
            setValues({...values,lessons: arr});
            toast("Lesson was updated Successfully")
        }

    }

    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">Update Course</h1>
            <div className="pt-3 pb-3">
                <CourseCreateForm 
                handleChange={handleChange} 
                handleImage={handleImage} 
                handleSubmit={handleSubmit} 
                values={values} 
                setValues={setValues}
                preview={preview}
                uploadButtonText={uploadButtonText}
                editPage={true}
                handleImageRemove={handleImageRemove}
                handleImageRemovee={handleImageRemovee}
                />
            </div>
           {/*  <pre>{JSON.stringify(values,null,4)}</pre>
            <br />
            <pre>{JSON.stringify(image,null,4)}</pre> */}
            <hr />
                <div className="row pb-5">
                    <div className="col lesson-list">
                        
                            {values && values.lessons && values.lessons.length && values.lessons.length === 1 ? (
                            
                                <h4>{values && values.lessons && values.lessons.length} Lesson</h4>
                            
                        ) : (
                                <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
                        )}
                        <List 
                        onDragOver={(e) => e.preventDefault()}
                        itemLayout="horizontal"
                        dataSource={values && values.lessons}
                        renderItem={(item,index)=>
                            (
                                <Item
                                draggable
                                onDragStart={e=>handleDrag(e, index)}
                                onDrop={e=> handleDrop(e, index)}
                                >
                                    <Item.Meta 
                                    onClick={()=> { 
                                        setVisible(true);
                                        setCurrent(item);

                                        }
                                    }
                                    avatar={<Avatar>{index+1}</Avatar>}
                                    title={item.title}>
                                    </Item.Meta>
                                <DeleteOutlined 
                                onClick={() => handleDelete(index)} 
                                className="text-danger float-end"/>
                                </Item>
                            )}></List>
                    </div>
                </div>
            <Modal
            title="Update lesson"
            centered
            visible={visible}
            onCancel={()=>setVisible(false)}
            footer={null}
            >
                    <UpdateLessonForm 
                    current={current} 
                    setCurrent={setCurrent} 
                    handleUpdateLesson={handleUpdateLesson} 
                    handleVideo={handleVideo} 
                    uploadVideoButtonText={uploadVideoButtonText}
                    setUploadVideoButtonText={setUploadButtonText}
                    progress={progress}
                    setProgress={setProgress}
                    uploading={uploading}
                    setUploading={setUploading}/>
            </Modal>
        </InstructorRoute>
    );
}

export default CourseEdit;
