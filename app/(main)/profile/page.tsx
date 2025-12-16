import ProfileForm from "@/app/components/profileform";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Profile = async () => {
  const cookiesToken = await cookies();
  const token = cookiesToken.get("user_token");
  const uid = cookiesToken.get("user_uid");

  if (!token && !uid) {
    redirect("/");
  }
  return (
    <div>
      <ProfileForm />
    </div>
  );
};

export default Profile;
