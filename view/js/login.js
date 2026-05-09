const toast = new Notyf({
  duration: 1800,
  position: {
    x: "center",
    y: "top",
  },
});

const getDashboardPath = () => {
  return location.pathname.startsWith("/view/")
    ? "/view/app/dashboard.html"
    : "/app/dashboard.html";
};

const login = async (e) => {
  try {
    e.preventDefault();
    const form = e.target;
    const element = form.elements;
    const payload = {
      email: element.email.value,
      password: element.password.value,
    };
    const { data } = await axios.post("http://localhost:8080/login", payload);
    toast.success(data.message);

    localStorage.setItem("authToken", data.token);
    setTimeout(() => {
      location.href = getDashboardPath();
    }, 2000);
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};
