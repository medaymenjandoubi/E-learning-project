import { Button ,Progress, Switch} from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import ReactPlayer from "react-player";
const UpdateLessonForm = ({
    current,
    setCurrent,
    handleUpdateLesson,
    handleVideo,
    uploadVideoButtonText,
    setUploadVideoButtonText,
    progress,
    setProgress,
    uploading,
    setUploading,}) => {
        return <div className="container pt-3">
            {/* <pre>{JSON.stringify(current,null,4)}</pre> */}
            <form onSubmit={handleUpdateLesson}>
                {/* lesson title input */}
                <input 
                type="text" 
                className="form-control square" 
                onChange={(e)=>setCurrent({...current,title: e.target.value})}
                value={current.title} 
                placeholder="Title"
                autoFocus
                required
                />
                {/* lesson content input */}
                <textarea className="form-control" 
                cols="7" 
                rows="7" 
                onChange={(e)=>setCurrent({...current,content:e.target.value})}
                value={current.content}
                >
                </textarea>
                {/* video input */}
                <div className="">
                    
                    {!uploading && current.video && current.video.Location && (
                        <div className="pt-2 d-flex justify-content-center">
                            <ReactPlayer 
                            url={current.video.Location}
                            width="410px"
                            height="240px"
                            controls/> 
                        </div>  
                    )}
                    <label className="btn btn-dark btn-block text-left mt-3 w-100 mb-2">
                        {uploadVideoButtonText}
                    <input onChange={handleVideo} type="file" accept="video/*" hidden/>
                    </label>
                </div> 

                {progress > 0 && ( 
                    <Progress 
                        className="d-flex justify-content-center pt-2"
                        percent={progress}
                        steps={10}
                    />
                )}

                <div className="d-flex justify-content-between pb-1 pt-1 mb-2 mt-2 bg bg-secondary text-white rounded-pill">
                    
                    <span className="mt-1 mb-1" style={{marginLeft:'20px'}}>Preview</span>
                    <Switch 
                    className="float-end mb-1 mt-1 " 
                    style={{marginRight:'20px'}} 
                    disabled={uploading} 
                    checked={current.free_preview}
                    name="free_preview"
                    onChange={(v) => setCurrent({...current, free_preview:v})}>
                    </Switch>
                    
                </div>
                <div className="text-center" >
                    <Button onClick={handleUpdateLesson} className="col" size="large" type="primary" loading={uploading} shape="round">Save</Button>
                </div>
                

            </form>
        </div>
};

export default UpdateLessonForm;