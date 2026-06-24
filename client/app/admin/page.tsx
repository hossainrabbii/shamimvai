import AdminDashboard from "@/components/AdminDashboard";
import { EnrollmentService } from "@/services/enrollment";

const AdminPage = async () => {
  const enrollments = await EnrollmentService.getAllEnrollmentsForAdmin();

  return (
    <div className="min-h-screen bg-secondary/30 font-bangla">
      <AdminDashboard enrollments={enrollments} />
    </div>
  );
};

export default AdminPage;