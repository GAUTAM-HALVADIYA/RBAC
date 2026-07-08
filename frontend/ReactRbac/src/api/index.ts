import api from "./client";
import { setupInterceptors } from "./interceptor";

setupInterceptors(api);

export default api;