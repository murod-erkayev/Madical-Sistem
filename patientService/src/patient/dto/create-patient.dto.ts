export class CreatePatientDto {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  bloodGroup: string; // ✅ FIXED: booldGroup → bloodGroup
  bio: string;
  isActive: boolean;
  doctorId: number;
}
