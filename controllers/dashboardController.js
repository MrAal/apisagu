// controllers/dashboardController.js
export const getDashboardData = (req, res) => {
  // Dapatkan data pengguna dari req.user
  const { id, username, nama, sebagai, email, departemen } = req.user;

  // Di sini Anda dapat mengambil data lain dari database atau melakukan operasi lain yang diperlukan
  res.json({
    user: {
      id,
      username,
      nama,
      sebagai,
      email,
      departemen
    }
  });
};
