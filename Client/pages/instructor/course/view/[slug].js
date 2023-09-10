import { useState,useEffect } from "react";
import  { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar ,Tooltip, Button,Modal,List} from "antd";
import { EditOutlined,CheckOutlined, UploadOutlined, QuestionOutlined, CloseOutlined } from "@ant-design/icons";
import AddLessonForm from "../../../../components/forms/AddLessonsForm";
import ReactMarkdown from "react-markdown"
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";
const CourseView = () => {
 const [course,setCourse] = useState({});
 //state for lessons display
 const [visible,setVisible] = useState(false);
 //state that will save the lesson content 
 const [values,setValues] = useState({
    title: "",
    content: "",
    video: {},
 });
 //state for the button to submit lesson add form in the modal AddLessonsForm.js 
 const [uploading,setUploading]=useState(false);
 //state to make video upload input text dynamic 
 const [uploadButtonText,setUploadButtonText]=useState('Upload Video')
const [progress,setProgress] =useState(0);
 const router = useRouter();
 const {slug} = router.query;

 useEffect(() => {
    loadcourse()
 }, [slug])

const loadcourse=async()=> {
    const {data}= await axios.get(`/api/course/${slug}`)
    setCourse(data);
}

//FUNCTIONS FOR ADD LESSON
const handleAddLesson = async(e) => {
    e.preventDefault();
try {
    const {data} = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, values)

    //console.log(data)
    setValues({...values,title: "",content: "", video : {}});
    setUploadButtonText('Upload video');
    setProgress(0)
    setVisible(false)
    setCourse(data);
    toast("Lesson added")
} catch (err) {
    console.log(err)
    toast("adding lesson failed")
}
}
const handleVideo = async (e) => {

try {
    
    const file =e.target.files[0]
    setUploadButtonText(file.name)
    setUploading(true)
    //console.log("handle video upload")
    const videoData = new FormData()
    videoData.append("video",file)
    const {data}=await axios.post(`/api/course/video-upload/${course.instructor._id}`,videoData, {
        onUploadProgress: (e) => {
            setProgress(Math.round((100*e.loaded)/e.total))
        }
    })
    console.log(data)
    setValues({...values, video: data})
    setUploading(false)
} catch (err) {
    setUploading(false)
    console.log(err)
    toast("Video Upload failed ...")
}
}

//handleVideoRemove function
const handleVideoRemove = async() => {
    try {
        setUploading(true)
        const {data}=await axios.post(`/api/course/video-remove/${course.instructor._id}`,values.video);
        console.log(data);
        setValues({...values, video: {}});
        setUploading(false)
        setUploadButtonText("Upload another video")
        
    } catch (err) {
        setUploading(false)
        console.log(err)
        toast("Video remove failed ...")
    }
}
//handleImageRemove function
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

const handlePublish =async (e,courseId) => {
    try {
        let answer = window.confirm('Once you publish your course it will be live in the marketplace for users to enroll')
        if (!answer) return;
        const {data} = await axios.put(`/api/course/publish/${courseId}`)
        setCourse(data)
        toast('Congrats ! your course is live')
    } catch (err) {
        console.log(err)
        toast("Course publish failed. Try again ")
    }


}
const handleUnpublish =async (e,courseId) => {
    try {
        let answer = window.confirm('Once you unpublish your course it will not be available for users to enroll')
        if (!answer) return;
        const {data} = await axios.put(`/api/course/unpublish/${courseId}`)
        setCourse(data)
        toast("Your course is unpublished")
    } catch (error) {
        toast("Course unpublish failed ")
    }

}

 return (
    <InstructorRoute>
        <div className="container-fluid pt-3">
            {/* <pre>{JSON.stringify(course,null,4)}</pre> */}
            {course &&( 
            <div className="container-fluid pt-1">
                <div className="media pt-2" style={{display:"flex" }}>
                    <Avatar size={80} src={course.image ? course.image.Location : "/course.png"}/>
                    <div className="media-body pl-2">
                        <div className="row">
                            <div className="col"style={{marginLeft:"10px"}}>
                                <h5 className="mt-2 text-primary">{course.name}</h5>
                                <p style={{marginTop: "-10px"}}>{course.lessons && course.lessons.length} Lessons</p>
                                <p style={{marginTop: '-15px', fontSize: "10px"}}>{course.category}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ marginLeft: 'auto', marginTop: '20px' }}>
                        <Tooltip title="Edit">
                            <EditOutlined
                                onClick={() => router.push(`/instructor/course/edit/${slug}`)}
                                className="h5 pointer text-warning"
                                style={{ marginRight: '10px' }} // Add right margin for spacing
                            />
                        </Tooltip>

                        {course.lessons && course.lessons.length < 5 ? (
                        <Tooltip title="Minimum five lessons required to publish a course">
                                <QuestionOutlined className="h5 pointer text-danger"/>
                        </Tooltip>
                        ): ( course.published ? (
                            <Tooltip title="Unpublish">
                                <CloseOutlined className="h5 pointer text-danger" onClick={e=>handleUnpublish(e,course._id)}/>
                            </Tooltip>)
                        : (
                            <Tooltip title="Publish">
                                <CheckOutlined className="h5 pointer text-success" onClick={e=>handlePublish(e,course._id)}/>
                            </Tooltip>) 
                        )}

                        {/* Add a gap between icons */}
                        <span style={{ marginRight: '20px' }}></span>
                    </div>
                    
                </div>
                <div style={{marginRight:"50px",marginLeft:"50px",marginTop:"30px"}}><ReactMarkdown source={course.description}/></div>
                <div className="row">
                        <Button
                        onClick={()=> setVisible(true)}
                        className="col-md-6 offset-md-3 text-center"
                        type="primary"
                        shape="round"
                        icon={<UploadOutlined/>}
                        size="large">
                                Add Lesson
                        </Button>
                </div>
                <br />
                {/* modal to add a lesson  */}
                <Modal title="+ Add Lesson"
                centered
                visible={visible}
                onCancel={()=> setVisible(false)}
                footer={null}>
                    {/* form component to get the lesson content such as title,videos.... */}  
                        <AddLessonForm 
                        values={values} 
                        setValues={setValues} 
                        handleAddLesson={handleAddLesson}
                        uploading={uploading}
                        setUploading={setUploading}
                        handleVideo={handleVideo}
                        uploadButtonText={uploadButtonText}
                        progress={progress}
                        handleVideoRemove={handleVideoRemove}
                        handleImageRemove={handleImageRemove}
                        />
                </Modal>

                <div className="row pb-5">
                    <div className="col lesson-list">
                        {
                        course && course.lessons && course.lessons.length && course.lessons.length === 1 ? 

                            (<h4>{course && course.lessons && course.lessons.length} Lesson</h4>)
                            :
                            (<h4>{course && course.lessons && course.lessons.length} Lessons</h4>)
                        }
                        <List itemLayout="horizontal" dataSource={course && course.lessons} renderItem={(item,index)=>
                            (
                                <Item>
                                    <Item.Meta 
                                        avatar={<Avatar>{index+1}</Avatar>}
                                        title={item.title}>
                                    </Item.Meta>

                                </Item>
                            )}></List>
                    </div>
                </div>
            </div>
            )}
        </div>
    </InstructorRoute>
 );
};

export default CourseView;