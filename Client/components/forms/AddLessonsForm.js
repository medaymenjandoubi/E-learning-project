import { Button ,Progress, Tooltip} from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
const AddLessonForm = ({values,setValues,handleAddLesson,uploading,uploadButtonText,handleVideo,progress,handleVideoRemove}) => {
        return <div className="container pt-3">
            <form onSubmit={handleAddLesson}>
                {/* lesson title input */}
                <input 
                type="text" 
                className="form-control square" 
                onChange={(e)=>setValues({...values,title: e.target.value})}
                value={values.title} 
                placeholder="Title"
                autoFocus
                required
                />
                {/* lesson content input */}
                <textarea className="form-control" 
                cols="7" 
                rows="7" 
                onChange={(e)=>setValues({...values,content:e.target.value})}
                value={values.content}
                placeholder="Content">
                </textarea>
                {/* video input */}
                <div className="d-flex justify-content-center">
                    <label className="btn btn-dark btn-block text-left mt-3 w-100 mb-2">
                        {uploadButtonText}
                        <input onChange={handleVideo} type="file" accept="video/*" hidden/>
                    </label>
                    {!uploading && values.video.Location && (
                        <Tooltip title="Remove">
                                <span onClick={handleVideoRemove} className="pt-1 pl-3 "style={{ marginLeft: '20px' }}>
                                    <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer"/>
                                </span>
                        </Tooltip>
                    )}
                </div> 

                {progress > 0 && 
                <Progress 
                        className="d-flex justify-content-center pt-2"
                        percent={progress}
                        steps={10}/>}

                <div className="text-center" >
                    <Button onClick={handleAddLesson} className="col" size="large" type="primary" loading={uploading} shape="round">Save</Button>
                </div>
                

            </form>
        </div>
};

export default AddLessonForm