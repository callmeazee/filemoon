const toast = new Notyf({
  duration: 1800,
  position: {
    x: "center",
    y: "top",
  },
});

axios.defaults.baseURL = SERVER;

// const getDashboardPath = () => {
//   return location.pathname.startsWith("/view/")
//     ? "/view/app/dashboard.html"
//     : "/dashboard";
// };

const login = async (e) => {
  try {
    e.preventDefault();
    const form = e.target;
    const element = form.elements;
    const payload = {
      email: element.email.value,
      password: element.password.value,
    };
    const { data } = await axios.post("/api/login", payload);
    toast.success(data.message);

    localStorage.setItem("authToken", data.token);
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    setTimeout(() => {
      location.href = "/dashboard";
    }, 2000);
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};
