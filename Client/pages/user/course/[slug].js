import { useRouter } from "next/router"
import axios from "axios";
import { useEffect, useState, createElement } from "react";
import { toast } from "react-toastify";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button,Menu,Avatar,List } from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import { PlayCircleOutlined,MenuFoldOutlined,MenuUnfoldOutlined, CheckCircleFilled, MinusCircleFilled } from "@ant-design/icons";
const SingleCourse = () => {
    const router = useRouter();
    const [loading,setLoading]=useState(false)
    const [collapsed,setCollapsed] = useState(false)
    const [course,setCourse]=useState({lessons: []})// course.lessons
    const [clicked, setClicked] = useState(-1);
    const [completedLessons,setCompletedLessons]= useState([])

    //force update state
    const [updateState,setUpdateState] = useState(false)

    const {slug} = router.query
    const {Item}= Menu
    useEffect(()=> {
        if (slug) loadCourse();
        /* console.log(collapsed) */
    }, [slug])

    useEffect(()=>{
        if (course) loadCompletedLessons();
    },[course])
    const loadCompletedLessons= async() =>{
        const {data}= await axios.post(`/api/list-completed`, {courseId: course._id})
        setCompletedLessons(data)
        console.log("Completed lessons => ", data)
    }
    const loadCourse = async () => {
        const { data } = await axios.get(`/api/user/course/${slug}`);
        setCourse(data);
      };
      const markCompleted = async ()=> {
        const {data} = await axios.post(`/api/mark-completed`, {
            courseId: course._id,
            lessonId: course.lessons[clicked]._id,
        })
        console.log("this is a data test",data)
        setCompletedLessons([...completedLessons,course.lessons[clicked]._id])


      }
      const markIncompleted = async ()=> {
        try {
            const {data} = await axios.post(`/api/mark-incompleted`, {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id,
            })
            //console.log("this is a data test",data)
            const all = completedLessons;
            //console.log("ALL", all)
            const index = all.indexOf(course.lessons[clicked]._id)
            if (index > -1){
                all.splice(index,1)
                setCompletedLessons(all)
                setUpdateState(!updateState)
            }
            //console.log("all without removed",all)
        } catch (err) {
            console.log(err)
            toast("mark incomplete failed, please try again ")
        }
      }
    return (
        <StudentRoute>
            {/* <h1>
                Course slug is : {router.query.slug}
            </h1> */}
            

            <div className="row">
                <div style={{ maxWidth: collapsed ? 80:320   }}>
                    <Button 
                    onClick={()=> {
                        setCollapsed(!collapsed);
                        /* console.log(collapsed); */
                    }}
                    className="text-primary btn-block mt-1 mb-2"
                    style={{width:"100%"}}
                    >
                        {createElement(collapsed ?  MenuUnfoldOutlined : MenuFoldOutlined)}{" "}
                        {!collapsed && "Lessons"}
                    </Button>
                    <Menu
                    defaultSelectedKeys={[clicked]}
                    inlineCollapsed={collapsed}
                    style={{height: '80vh',overflow:"scroll"}}>
                        
                        {course.lessons.map((lesson,index)=>(
                            <Item onClick={() => setClicked(index)} 
                            key={index} 
                            icon={<Avatar>{index+1}</Avatar>}>
                                {lesson.title.substring(0,30)} {completedLessons.includes(lesson._id) ?
                                 (<CheckCircleFilled className="float-end text-primary ml-2" style={{marginTop:"13px"}}/>)
                                : 
                                (<MinusCircleFilled className="float-end text-danger ml-2" style={{marginTop:"13px"}}/>)}
                            </Item>
                        ))}
                    </Menu>
                </div>
                <div className="col">
                    {clicked !== -1 ? 
                    (<>
                        <div className="col alert alert-primary square">
                            <b>{course.lessons[clicked].title.substring(0,30)}</b>
                            {completedLessons.includes(course.lessons[clicked]._id )?(
                            <span 
                            className="float-end pointer" 
                            onClick={()=>markIncompleted()}>
                                 Mark As incompleted
                            </span>
                            ): (
                            <span className="float-end pointer" 
                            onClick={()=>markCompleted()}>
                                 Mark As completed
                            </span>
                            )}

                        </div>
                        {course.lessons[clicked].video &&
                            course.lessons[clicked].video.Location && (
                            <>
                                <div className="wrapper" style={{height:"400px", width:"100%"}}>
                                    <ReactPlayer 
                                    className="player" 
                                    url={course.lessons[clicked].video.Location} 
                                    width="100%" 
                                    height="100%"
                                    controls
                                    onEnded={()=>markCompleted()}/>
                                </div>

                            </>
                        )}
                        <ReactMarkdown source={course.lessons[clicked].content} className="single-post" />
                        
                    </>) 
                    : 
                    (<div className="d-flex justify-content-center p-5">
                        <div className="text-center p-5">
                            <PlayCircleOutlined className="text-primary display-1 p-5"/>
                            <p className="lead"> Click on the lessons to start learning</p>
                        </div>    
                    </div>
                    )}
                </div>
            </div>
            
        </StudentRoute>
    )
}
export default SingleCourse;