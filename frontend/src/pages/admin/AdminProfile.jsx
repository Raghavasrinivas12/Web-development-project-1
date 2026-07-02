import { useState, useRef } from "react";
import {
  User,
  Camera,
  Edit3,
  Mail,
  Phone,
  Shield,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";

const AdminProfile = () => {

  const [profile, setProfile] = useState({
    name: "Anusha Devi",
    email: "admin@gmail.com",
    phone: "+91 9876543210",
    dob: "2002-01-01",
    gender: "Female",
    address: "Bengaluru, Karnataka",
    role: "Super Admin",
    department: "Administration",
    joined: "15 Jan 2025",
    lastLogin: "Today • 09:30 AM",
    status: "Active",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [showCurrent,setShowCurrent]=useState(false);
  const [showNew,setShowNew]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  const personalInfoRef=useRef(null);

  const handleImage = (e) => {
    const file=e.target.files[0];

    if (!file)  return;
      const reader=new FileReader();
      reader.onload=(event)=>{
        setProfileImage(event.target.result);
      };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}

      <div className="flex items-center gap-3 mb-8">

        <User className="text-blue-500" size={30} />

        <div>

          <h1 className="text-3xl font-bold">
            Admin Profile
          </h1>

          <p className="text-slate-400">
            Manage your profile information.
          </p>

        </div>

      </div>

      {/* Profile Card */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

        <div className="flex flex-col md:flex-row items-center gap-6">

          <div className="relative">

            {profileImage ? (

              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                onError={(e)=>{
                    console.log("Image failed to load");
                    console.log(profileImage);
                }}
              />

            ) : (

              <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-blue-500">

                <User size={60} />

              </div>

            )}

            <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">

              <Camera size={18} />

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />

            </label>

          </div>

          <div className="flex-1">

            <h2 className="text-2xl font-bold">
              {profile.name}
            </h2>

            <p className="text-slate-400">
              {profile.role}
            </p>

            <div className="flex flex-wrap gap-5 mt-4 text-slate-300">

              <div className="flex items-center gap-2">
                <Mail size={18} />
                {profile.email}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={18} />
                {profile.phone}
              </div>

            </div>

            <button onClick={()=>personalInfoRef.current?.scrollIntoView({behavior:"smooth",})} className="mt-6 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg flex items-center gap-2">

              <Edit3 size={18} />

              Edit Profile

            </button>

          </div>

        </div>

      </div>

   
      {/* Personal Information */}

      <div ref={personalInfoRef} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

        <div className="flex items-center gap-3 mb-6">

          <User className="text-blue-500" size={24} />

          <div>

            <h2 className="text-xl font-semibold">
              Personal Information
            </h2>

            <p className="text-slate-400 text-sm">
              Update your personal details.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Full Name */}

          <div>

            <label className="text-sm text-slate-400">
              Full Name
            </label>

            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Email */}

          <div>

            <label className="text-sm text-slate-400">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Phone */}

          <div>

            <label className="text-sm text-slate-400">
              Phone Number
            </label>

            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone: e.target.value,
                })
              }
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Date of Birth */}

          <div>

            <label className="text-sm text-slate-400">
              Date of Birth
            </label>

            <input
              type="date"
              value={profile.dob}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  dob: e.target.value,
                })
              }
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Gender */}

          <div>

            <label className="text-sm text-slate-400">
              Gender
            </label>

            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  gender: e.target.value,
                })
              }
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            >

              <option>Female</option>
              <option>Male</option>
              <option>Other</option>

            </select>

          </div>

          {/* Address */}

          <div className="md:col-span-2">

            <label className="text-sm text-slate-400">
              Address
            </label>

            <textarea
              rows="4"
              value={profile.address}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: e.target.value,
                })
              }
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 resize-none outline-none focus:border-blue-500"
            />

          </div>

        </div>

      </div>

   
      {/* Account Information */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

        <div className="flex items-center gap-3 mb-6">

          <Shield className="text-blue-500" size={24} />

          <div>

            <h2 className="text-xl font-semibold">
              Account Information
            </h2>

            <p className="text-slate-400 text-sm">
              View your account details.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="text-sm text-slate-400">
              Role
            </label>

            <input
              type="text"
              value={profile.role}
              readOnly
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            />

          </div>

          <div>

            <label className="text-sm text-slate-400">
              Department
            </label>

            <input
              type="text"
              value={profile.department}
              readOnly
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            />

          </div>

          <div>

            <label className="text-sm text-slate-400">
              Joined Date
            </label>

            <input
              type="text"
              value={profile.joined}
              readOnly
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            />

          </div>

          <div>

            <label className="text-sm text-slate-400">
              Last Login
            </label>

            <input
              type="text"
              value={profile.lastLogin}
              readOnly
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            />

          </div>

          <div>

            <label className="text-sm text-slate-400">
              Account Status
            </label>

            <div className="mt-2">

              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full">

                {profile.status}

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Dashboard Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h3 className="text-slate-400 text-sm">
            Total Logins
          </h3>

          <p className="text-3xl font-bold mt-3">
            1,245
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h3 className="text-slate-400 text-sm">
            Orders Managed
          </h3>

          <p className="text-3xl font-bold mt-3">
            845
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h3 className="text-slate-400 text-sm">
            Vendors Approved
          </h3>

          <p className="text-3xl font-bold mt-3">
            132
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h3 className="text-slate-400 text-sm">
            Reports Generated
          </h3>

          <p className="text-3xl font-bold mt-3">
            98
          </p>

        </div>

      </div>

   
      {/* Security */}

<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

  <div className="flex items-center gap-3 mb-6">

    <Lock className="text-blue-500" />

    <div>

      <h2 className="text-xl font-semibold">
        Change Password
      </h2>

      <p className="text-slate-400 text-sm">
        Update your account password.
      </p>

    </div>

  </div>

  {/* Current Password */}

  <div className="mb-5">

    <label className="text-sm text-slate-400">
      Current Password
    </label>

    <div className="relative mt-2">

      <input
        type={showCurrent ? "text" : "password"}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500"
      />

      <button
        type="button"
        onClick={() => setShowCurrent(!showCurrent)}
        className="absolute right-4 top-3 text-slate-400"
      >
        {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

    </div>

  </div>

  {/* New Password */}

  <div className="mb-5">

    <label className="text-sm text-slate-400">
      New Password
    </label>

    <div className="relative mt-2">

      <input
        type={showNew ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500"
      />

      <button
        type="button"
        onClick={() => setShowNew(!showNew)}
        className="absolute right-4 top-3 text-slate-400"
      >
        {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

    </div>

  </div>

  {/* Confirm Password */}

  <div>

    <label className="text-sm text-slate-400">
      Confirm Password
    </label>

    <div className="relative mt-2">

      <input
        type={showConfirm ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500"
      />

      <button
        type="button"
        onClick={() => setShowConfirm(!showConfirm)}
        className="absolute right-4 top-3 text-slate-400"
      >
        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

    </div>

  </div>

  <div className="flex justify-end mt-6">

    <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg">
      Change Password
    </button>

  </div>

</div>


{/* Recent Activity */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

        <h2 className="text-xl font-semibold mb-6">
          Recent Activity
        </h2>

        <div className="space-y-5">

          <div className="border-l-4 border-green-500 pl-4">

            <h3 className="font-medium">
              Logged into Admin Dashboard
            </h3>

            <p className="text-sm text-slate-400">
              Today • 09:30 AM
            </p>

          </div>

          <div className="border-l-4 border-blue-500 pl-4">

            <h3 className="font-medium">
              Approved Vendor - Tech World
            </h3>

            <p className="text-sm text-slate-400">
              Yesterday • 04:15 PM
            </p>

          </div>

          <div className="border-l-4 border-yellow-500 pl-4">

            <h3 className="font-medium">
              Updated Privacy Policy
            </h3>

            <p className="text-sm text-slate-400">
              2 Days Ago • 11:45 AM
            </p>

          </div>

          <div className="border-l-4 border-red-500 pl-4">

            <h3 className="font-medium">
              Generated Sales Report
            </h3>

            <p className="text-sm text-slate-400">
              3 Days Ago • 06:20 PM
            </p>

          </div>

        </div>

      </div>

      {/* Action Buttons */}

      <div className="flex justify-end gap-4 mb-10">

        <button
          className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => toast.success("Profile updated successfully!")}
          className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition flex items-center gap-2"
        >
          <Edit3 size={18} />
          Save Changes
        </button>

      </div>

    </div>
  );
};

export default AdminProfile;