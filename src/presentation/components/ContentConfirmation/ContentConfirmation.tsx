interface ContentConfirmationProps {
  status: 'permissionDenied' | 'gpsError' | 'customer' | 'vendor';
}

const ContentConfirmation: React.FC<ContentConfirmationProps> = ({ status }) => {
  switch (status) {
    case 'permissionDenied':
      return (
        <>
          <p className="font-semibold">Akses lokasi ditolak</p>
          <p className="text-sm text-gray-500 mt-4">
            Mohon mengaktifkan layanan lokasi di pengaturan browser kamu dan coba lagi.
          </p>
        </>
      );
    case 'gpsError':
      return (
        <>
          <p className="font-semibold">Sinyal GPS lemah</p>
          <p className="text-sm text-gray-500 mt-4">
            Mohon pastikan kamu berada di tempat dengan sinyal GPS yang baik dan coba lagi.
          </p>
        </>
      );
    case 'customer':
      return <p>Dengan menutup halaman ini, kamu akan keluar dari pantauan Tukang Bakso</p>;
    case 'vendor':
      return <p>Dengan menutup halaman ini, kamu akan keluar dari pantauan Customer</p>;
    default:
      return null;
  }
};

export default ContentConfirmation;
