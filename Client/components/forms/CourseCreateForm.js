import { Select, Button ,Avatar, Badge} from "antd";

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove,
  editPage=false,
  handleImageRemovee
}) => {
  /* {editPage && console.log(values.image)} */
  const children = []
  for (let i = 9.99 ; i <= 999.99; i++){
    children.push(<Option key={i.toFixed(2)}>€{i.toFixed(2)}</Option>)
  }
  return (
    <>
    {values && (
      <form onSubmit={handleSubmit} >
      <div className="form-group" style={{margin: "20px"}}>
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
        />
      </div>
  
      <div className="form-group" style={{margin: "20px"}}>
        <textarea
          name="description"
          cols="7"
          rows="7"
          value={values.description}
          className="form-control"
          onChange={handleChange}
        ></textarea>
      </div>
  
      <div className="form-row" style={{ display: 'flex', alignItems: 'flex-start' , margin: '20px'}}>
        <div className="col" style={{ flex: 0.7 }}>
          <div className="form-group">
            <Select
              style={{ width: "100%" }}
              size="large"
              value={values.paid}
              onChange={(v) => setValues({ ...values, paid: !values.paid })}
            >
              <Option value={true}>Paid</Option>
              <Option value={false}>Free</Option>
            </Select>
          </div>
        </div>
        {values.paid && <div className="col-md-6" style={{ flex: 0.3, marginLeft: '16px' }}>
            <div className="form-group">
                  <Select 
                  defaultValue="€99.99"
                  style={{width: '100%'}}
                  onChange={(v) => setValues({...values, price: v})}
                  tokenSeparators={[,]}
                  size="large"
                  >
                    {children}
                  </Select>
            </div>
          </div>}
      </div>
      <div className="form-group" style={{margin: "20px"}}>
        <input
          type="text"
          name="category"
          className="form-control"
          placeholder="Category"
          value={values.category}
          onChange={handleChange}
        />
      </div>
  
      <div className="form-row" style={{ display: 'flex', alignItems: 'flex-start' , margin: '20px'}}>
        <div className="col">
          <div className="form-group">
            <label className="btn btn-outline-secondary btn-block text-left w-100">
              {uploadButtonText}
              <input
                type="file"
                name="image"
                onChange={handleImage}
                accept="image/*"
                hidden
              />
            </label>
          </div>
        </div>
        {preview && 
        <Badge count="X" onClick={handleImageRemove} className="pointer">
          <Avatar width={200} src={preview}/>
        </Badge>}

        {editPage && values.image && !preview && (
          <Badge count="X" onClick={handleImageRemovee} className="pointer">
            <Avatar width={200} src={values.image.Location} />
          </Badge>
        )}
      </div>
  
      <div className="row text-center" >
        <div className="col" >
          <Button
            onClick={handleSubmit}
            disabled={values.loading || values.uploading}
            className="btn btn-primary"
            loading={values.loading}
            type="primary"
            size="large"
            shape="round"
          >
            {values.loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </form>
    )}
    </>
  );
}

export default CourseCreateForm;
