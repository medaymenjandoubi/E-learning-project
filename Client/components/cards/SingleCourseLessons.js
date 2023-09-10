import { List ,Avatar} from "antd";

const {Item}=List
const SingleCourseLesson =({lessons,setShowModal,showModal,preview,setPreview})=> {
    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col lesson-list">
                        {lessons && <h4>{lessons.length} Lessons</h4>}
                        <hr />
                        <List
                        itemLayout="horizontal"
                        dataSource={lessons}
                        renderItem={(item,index) => (
                        <>
                             <Item>
                                <Item.Meta 
                                avatar={<Avatar>{index + 1}</Avatar>} 
                                title={item.title}/>

                                {item.video && item.video != null && item.free_preview && (
                                    <span className="text-primary pointer font-weight-bold" onClick={() => {
                                        setPreview(item.video.Location);
                                        setShowModal(!showModal);
                                    }}>Preview</span>
                                )}
                             </Item>
                             <hr />   
                        </>
                        )}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default SingleCourseLesson;