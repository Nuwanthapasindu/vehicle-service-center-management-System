import axios from "axios";

const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/v1/file", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const deleteFile = async (fileId) => {
    try {
        const response = await axios.delete(`/api/v1/file/${fileId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const FileService = {
    uploadFile,
    deleteFile
};

export default FileService;
