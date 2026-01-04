import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./Card.css";

function Card({ item }) {
  const copyToClipboard = (address) => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.success("주소가 복사되었습니다!", {
          position: "top-center",
          autoClose: 3000, // 3초 후 자동으로 사라짐
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      })
      .catch((error) => {
        console.error("복사 실패:", error);
      });
  };

  return (
    <div className="card">
      <h3 className="name">{item.name}</h3>
      {item.description && <p className="desc">{item.description}</p>}
      {item.address && (
        <p className="address">
          주소: {item.address}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => copyToClipboard(item.address)}
          >
            주소 복사
          </button>
        </p>
      )}
      {item.link?.length &&
        item.link.map((_item, index) => {
          return (
            <a
              key={index}
              href={_item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="delivery-link"
              title={`${_item.platform} 링크`}
            >
              📲 {_item.platform}
            </a>
          );
        })}
      {item.rated && (
        <p className="rated">
          {item.rated} <span>({item.rated.length})</span>
        </p>
      )}
      <div className="tag-wrap">
        <p>태그:</p>
        {item.tags.length && (
          <ul className="tags">
            {item.tags.map((tag, index) => (
              <li key={index}>#{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Card;
