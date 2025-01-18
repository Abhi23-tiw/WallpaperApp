import axios from "axios";

const API_KEY = '48233322-f5bbcc078f55b2fecda7d763a';
const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params = {}) => {
    let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true";
    if (!params || Object.keys(params).length === 0) return url;

    Object.keys(params).forEach((key) => {
        const value = key === 'q' ? encodeURIComponent(params[key]) : params[key];
        if (value !== undefined && value !== null && value !== "") {
            url += `&${key}=${value}`;
        }
    });

    return url;
};

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params));
        const { data } = response;
        return { success: true, data };
    } catch (err) {
        console.error('Error during API call:', err.message);
        return { success: false, msg: err.message };
    }
};
