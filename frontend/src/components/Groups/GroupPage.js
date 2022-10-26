import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroup } from "../../utils/apiHelper";
import Loading from "../Loading";

const GroupPage = () => {
  const { path } = useParams();

  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (path === "undefined") {
      navigate("/error");
    } else {
      setLoading(true);
      getGroup(path)
        .then((group) => {
          setGroup(group);
        })
        .then(() => setLoading(false))
        .catch((err) => console.log("GroupPage: ", err));
    }
  }, [path, navigate]);

  return <>{loading ? <Loading /> : <h2>{group.title}</h2>}</>;
};

export default GroupPage;
