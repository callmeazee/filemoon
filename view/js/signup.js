const toast = new Notyf({
     duration: 1800,
     position: {
          x: 'center',
          y: 'top'
     }
});

axios.defaults.baseURL = SERVER;

const signup = async (e) => {
      
     try {
           e.preventDefault();
            
     const form = e.target
          const element = form.elements
        
     const payload = {
          fullname : element.fullname.value,
          email: element.email.value,
          mobile: element.mobile.value,
          password: element.password.value
          }
       const {data} = await axios.post("/api/signup", payload)
          toast.success(data.message)
          setTimeout(() => {
               location.href = "/login"

          }, 2000)
      
     } catch (err) {
          toast.error(err.response? err.response.data.message: err.message)
         
 }
}
