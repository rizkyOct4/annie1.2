export interface ModalState {
  isOpen: boolean;
  isValue: "Profile" | "Photos" | "Videos" | "Music" ;
  isPublicId: number | null;
}