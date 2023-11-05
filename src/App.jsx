import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [product, setProduct] = useState([]);
  const [select, setSelect] = useState([]);

  // select handler
  const selectHandler = (data) => {
    const find = select.find((item) => item.id === data.id);
    if (!find) {
      setSelect([...select, data]);
    } else {
      const remaining = select.filter((item) => item.id !== data.id);
      setSelect([...remaining]);
    }
  };

  // delete handler
  const deleteHandler = () => {
    const remaining = product.filter((item) => {
      const find = select.find((i) => i.id === item.id);
      if (find) {
        return false;
      } else {
        return true;
      }
    });
    setProduct(remaining);
    setSelect([]);
    toast.success("delete successfully");
  };

  // drag and drop functionality
  const dragStart = (e, dragIndex) => {
    e.dataTransfer.setData("dragIndex", dragIndex);
  };
  const dragOver = (e) => {
    e.preventDefault();
  };

  const drop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData("dragIndex");
    const tempProduct = [...product];
    const copy = tempProduct[dropIndex];
    tempProduct[dropIndex] = tempProduct[dragIndex];
    tempProduct[dragIndex] = copy;
    setProduct(tempProduct);
  };

  // product call from external api call
  useEffect(() => {
    fetch("data.json")
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      });
  }, []);

  return (
    <div className="all">
      <div className="container">
        <p className="notice">
          Drag and drop feature implement raw js coding, not using any drag and
          drop npm package
        </p>
        <div className="header">
          <div className="title">
            {select.length ? (
              <div>
                <input type="checkbox" checked={select.length && true} />{" "}
                <span> {select.length} file selected</span>
              </div>
            ) : (
              <span>Gallery</span>
            )}
          </div>
          <div>
            {select.length > 0 && (
              <div
                onClick={deleteHandler}
                style={{ color: "red", cursor: "pointer" }}
              >
                Delete file
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="content">
          {product.length > 0 &&
            product.map((item, index) => (
              <div
                key={item?.id}
                className="content-item"
                draggable
                onDragStart={(e) => dragStart(e, index)}
                onDragOver={(e) => dragOver(e, index)}
                onDrop={(e) => drop(e, index)}
              >
                <img src={item?.image} alt="image" className="gallery-img" />
                <div className="hover-item">
                  <input type="checkbox" onChange={() => selectHandler(item)} />
                </div>
              </div>
            ))}
          <div draggable="false">
            <div>
              <img src="/images/placeholder-image.png" alt="image" width={40} />
              <p>Add Images</p>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
