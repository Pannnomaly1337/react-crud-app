import ToggleButton from "./ToggleButton";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DataTableAdmin ()
{
    const url = "https://67eca027aa794fb3222e43e2.mockapi.io/members";

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", lastname: "", position: "" });
    const [saving, setSaving] = useState(false);

    useEffect (() => {

        console.log("useEffect started. . .");

        const fetchData = async () => {

            try {

                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {

                setError(error);
                console.log(error);
            } finally {

                setLoading(false);
                console.log("useEffect finished. . .");
            }
        };

        fetchData();
    }, []);

    console.log(data);

    const handleDelete = async (id) => {

        try {

            await axios.delete(`${url}/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
            console.log("Delete successful");
        } catch (error) {
            setError(error);
            console.log(error);
        }
    };

    const handleEdit = (item) => {

        setEditingId(item.id);
        setEditForm({ name: item.name, lastname: item.lastname, position: item.position });
    };

    const handleCancel = () => {

        setEditingId(null);
        setEditForm({ name: "", lastname: "", position: "" });
    };

    const handleEditChange = (event) => {

        const { name, value } = event.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (id) => {

        try {

            setSaving(true);
            const response = await axios.put(`${url}/${id}`, editForm);
            setData(prev => prev.map(item => (item.id === id ? response.data : item)));
            setEditingId(null);
            console.log("Update successful");
        } catch (error) {
            setError(error);
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading)
    {
        return <div className="w-full flex justify-center items-center font-semibold text-xl mt-10">Loading data. . .</div>
    }

    if (error)
    {
        return (
            <div className="w-full flex justify-center items-center font-semibold text-xl text-red-500 mt-10">
                Error: {error.message}
            </div>
        );
    }

    const editInputClass = "w-40 h-12 px-3 text-lg text-center bg-pink-100 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-pink-300";

    return (
        <div className="flex justify-center items-center mt-20">
            <table className="text-center text-xl shadow-md">
                <thead>
                    <tr className="bg-pink-200">
                        <th className="border px-30 py-4">Name</th>
                        <th className="border px-30 py-4">Lastname</th>
                        <th className="border px-30 py-4">Position</th>
                        <th className="border px-30 py-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {

                        const isEditing = editingId === item.id;

                        return (
                            <tr key={item.id}>
                                <td className="border px-30 py-4">
                                    {isEditing
                                        ? <input name="name" type="text" value={editForm.name} onChange={handleEditChange} className={editInputClass} />
                                        : item.name}
                                </td>
                                <td className="border px-30 py-4">
                                    {isEditing
                                        ? <input name="lastname" type="text" value={editForm.lastname} onChange={handleEditChange} className={editInputClass} />
                                        : item.lastname}
                                </td>
                                <td className="border px-30 py-4">
                                    {isEditing
                                        ? <input name="position" type="text" value={editForm.position} onChange={handleEditChange} className={editInputClass} />
                                        : item.position}
                                </td>
                                <td className="border px-30 py-4">
                                    <div className="flex gap-x-3 justify-center">
                                        {isEditing ? (
                                            <>
                                                <ToggleButton type={"button"} onClick={() => handleSave(item.id)} disabled={saving}>Save</ToggleButton>
                                                <ToggleButton type={"button"} onClick={handleCancel} disabled={saving}>Cancel</ToggleButton>
                                            </>
                                        ) : (
                                            <>
                                                <ToggleButton type={"button"} onClick={() => handleEdit(item)}>Edit</ToggleButton>
                                                <ToggleButton type={"button"} onClick={() => handleDelete(item.id)}>Delete</ToggleButton>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}