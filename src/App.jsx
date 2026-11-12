import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { allcategory, closeForm } from "./features/uiSlice";
import axios from "axios";
import { useState } from "react";

export default function App() {
  const dispatch = useDispatch();
  const queryclient = useQueryClient();

  const Categories = useSelector((state) => state.ui.Categories);
 

  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("study materials");

  const queryusers = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/product");
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newProduct) => {
      const res = await axios.post("http://localhost:3000/product", newProduct);
      return res.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/product/${id}`);
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const add = () => {
    if (name === "") return;
    addMutation.mutate({ name, price, category });
    setname("");
    setprice("");
    dispatch(closeForm());
  };

  if (queryusers.isLoading) return <h1>loading...</h1>;
  if (queryusers.isError) return <h1>error...</h1>;

  const filtered =
    Categories === "all"
      ? queryusers.data
      : queryusers.data.filter((item) => item.category === Categories);

  return (
    <div>
      <h1>products</h1>

      <select
        value={Categories}
        onChange={(e) => dispatch(allcategory(e.target.value))}
      >
        <option value="all">all</option>
        <option value="study materials">study materials</option>
        <option value="clothes">clothes</option>
      </select>


      
        <div>
          <input placeholder="name" value={name} onChange={(e) => setname(e.target.value)} />
          <input placeholder="price" value={price} onChange={(e) => setprice(e.target.value)} />
          <input placeholder="category" value={category} onChange={(e) => setcategory(e.target.value)} />
          <button onClick={add}>add</button>
        </div>
      

      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            {item.name} - {item.price} - {item.category}
            <button onClick={() => deleteMutation.mutate(item.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}