import { useContext,useEffect, useState } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Avatar } from "antd";
import Link from "next/link";
import { SyncOutlined, PlayCircleOutlined  } from "@ant-design/icons";
import { toast } from "react-toastify";



const UserIndex= () => {
    const [courses,setCourses] = useState([])
    const [loading,setLoading] = useState(false);
    const {
        state: {user},} = useContext(Context);
        
    useEffect(()=>{
        loadCourses()
    },[])

    const loadCourses = async ()=>{
        try {
            setLoading(true)
            const {data} = await axios.get('/api/user-courses')
            setCourses(data)
            /* console.log("courses upload test",data) */
            setLoading(false)
        } catch (err) {
            console.log(err)
            toast("Courses upload failed")
            setLoading(false)
        }

    }
    return (
    <UserRoute>
        {loading && (<SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5"/>)}
        <h1 className="jumbotron text-center square ">
            user dashboard
        </h1>
        {/* <pre>{JSON.stringify(courses,null,4)}</pre> */}
        {/* Show list of courses*/}
        {courses && courses.map(course => (
  <div key={course._id} className="media pt-2 pb-1 ">
    <div className="row">
      <div className="col-1" style={{marginLeft:"130px"}}> 
        <Avatar size={80} shape="square" src={course.image ? course.image.Location : "../course.png"}></Avatar>
      </div>
      <div className="col" style={{marginLeft:'20px',marginRight:"0px"}}>
        <div className="media-body ">
          <Link href={`/user/course/${course.slug}`} className="pointer">
            <h5 className="mt-2 text-primary">{course.name}</h5>
          </Link>
          <p style={{ marginTop: '-10px' }}>{course.lessons.length} Lessons</p>
          <p className="text-muted" style={{ marginTop: "-15px", fontSize: '12px' }}>
            By {course.instructor.name}
          </p>
        </div>
      </div>
      <div className="col text-center"> {/* Colonne pour l'icône de lecture */}
        <Link href={`/user/course/${course.slug}`} className="pointer">
          <PlayCircleOutlined className="h2 pointer" />
        </Link>
      </div>
    </div>
  </div>
))}


    </UserRoute>
    )
};
export default UserIndex;