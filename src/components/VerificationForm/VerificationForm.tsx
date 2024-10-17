'use client';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../../lib/firebase";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useLocalStorage from '../../hooks/useLocalStorage';

type FormData = {
  name: string;
  role: string;
  terms: boolean;
};

export default function VerificationForm() {
  const router = useRouter();
  const [, setUser] = useLocalStorage('user', { name: '', role: '', docId: '' });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: data.name,
        role: data.role,
        status: "active",
        createdAt: new Date(),
      });
      const userData = {
        name: data.name,
        role: data.role,
        docId: docRef.id,
      };

      setUser(userData);

      toast.success(`Selamat datang, ${data.name}!`);

      router.push("/");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-11/12 max-w-md md:bg-white bg-transparent p-4 md:p-8 md:rounded-lg rounded-none md:shadow-md shadow-none text-center">
          <div className="mb-6">
            <Image src="/images/home.png" alt="Illustration" className="mx-auto mb-4" width={150} height={120} priority={true} />
            <h1 className="text-2xl font-tsel-batik font-bold text-black">Verifikasi</h1>
            <p className="text-sm text-gray-500 mt-2">
              Masukkan nama dan role Anda di bawah ini:
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-left text-gray-600">Nama</label>
              <input
                type="text"
                placeholder="Masukkan nama"
                {...register("name", { required: "Nama harus diisi", maxLength: { value: 60, message: "Max 60 characters" } })}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1 text-left">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-left font-poppins text-gray-600">Role</label>
              <select
                {...register("role", { required: "Role harus diisi" })}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700"
              >
                <option value="">Pilih peran</option>
                <option value="customer">Customer</option>
                <option value="vendor">Tukang Bakso</option>
              </select>
              {errors.role && <p className="text-red-500 text-left text-sm mt-1">{errors.role.message}</p>}
            </div>
            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full font-poppins text-white ${isValid ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'
                }`}
              disabled={!isValid}
            >
              Join
            </button>
            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", { required: "Kamu harus menyetujui syarat dan ketentuan" })}
                className="mt-1 mr-2"
              />
              <label htmlFor="terms" className="text-sm font-poppins text-gray-500 text-left">
                Dengan menggunakan aplikasi ini Anda telah setuju untuk membagikan lokasi Anda kepada para tukang Bakso Keliling.
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm mt-1 text-left">{errors.terms.message}</p>}
          </form>
        </div>
      </div>
    </>
  );
}