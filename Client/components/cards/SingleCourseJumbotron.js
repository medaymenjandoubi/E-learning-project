import { currencyFormatter } from "../../utils/helpers";
import { Badge ,Modal,Button} from "antd";
import ReactPlayer from "react-player";
import { useState,useEffect } from "react";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";
const SingleCourseJumbotron =({
  course,
  setShowModal,
  showModal,
  preview,
  setPreview,
  handlePaidEnrollment,
  handleFreeEnrollment,
  loading,
  user,
  enrolled,
  setEnrolled,
}) => {
//course props destructure 
  const { name,
     description,
      instructor,
       updatedAt,
        lessons,
         image,
          price,
           paid,
            category } = course;
const [shouldRenderReactPlayer, setShouldRenderReactPlayer] = useState(false);
    
  useEffect(() => {
    if (typeof window !== 'undefined' && lessons[0]?.video?.Location) {
      // Mark that the ReactPlayer should be rendered
      setShouldRenderReactPlayer(true);
    }
  }, []);
  /* console.log(enrolled)  checking data flow*/
 return (
    <div className="jumbotrone bg-primary square">
    <div className="row m-2 pt-5 pb-5">
      <div className="col-md-8">
        {/*title*/}
        <h1 className="text-light font-weight-bold">{name}</h1>
        {/*description*/}
        <h4 className="lead" style={{ color: "white" }}>{description && description.substring(0, 160)}...</h4>
        {/*category*/}
        <Badge count={category} style={{ backgroundColor: "#03a9f4" }} className="pb-4 mr-2"></Badge>
        {/*author*/}
        <p>Created by {instructor.name}</p>
        {/*updated at */}
        <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
        {/*price*/}
        <h4 className="text-light">{paid ? currencyFormatter({
          amount: price,
          currency: 'eur'
        }) : "Free"}</h4>
      </div>
      <div className="col-md-4" style={{width:"400px"}}>
        {/* show video preview or course image */}
        {shouldRenderReactPlayer ? (
        <div className="pb-3" onClick={()=> {
            setPreview(lessons[0].video.Location)
            setShowModal(!showModal)
        }}>
              <ReactPlayer
                className="react-player-div"
                url={lessons[0].video.Location}
                light={image.Location}
                width="100%"
                height="225px"
              />
        </div>
        ) : (
          <img src={image.Location} alt={name} className="img img-fluid" />
        )}
        {/*enroll button*/}
        {loading? 
        <div className="d-flex justify-content-center">
              <LoadingOutlined className="h1 text-danger"/>
        </div>:
        <div className="d-flex justify-content-center">
          <Button 
          className="mb-1 pb-4" 
          type="danger"
          block
          shape="round"
          icon={<SafetyOutlined/>}
          disabled={loading}
          
          onClick={paid ? handlePaidEnrollment :handleFreeEnrollment}>
          {user && enrolled ? enrolled.status ? "Go to course": "Enroll" : "Login to Enroll"}</Button>
          </div>}
      </div>
    </div>
  </div>
 )
}
export default SingleCourseJumbotron;