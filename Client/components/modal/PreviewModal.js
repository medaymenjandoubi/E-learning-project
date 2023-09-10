import { Modal } from "antd";
import ReactPlayer from "react-player";


const PreviewModal =({showModal,setShowModal,preview}) => {
    
    return (
        <>
                <Modal 
                title="Course Preview" 
                visible={showModal} 
                onCancel={()=> setShowModal(!showModal)}
                width={720}
                footer={null}
                destroyOnClose={true}>
                    <div className="wrapper">
                        <ReactPlayer 
                        url={preview} 
                        controls={true} 
                        playing={showModal}
                        width="100%"
                        height="100%"></ReactPlayer> 
                    </div>
                </Modal>
        </>
    )
}
export default PreviewModal