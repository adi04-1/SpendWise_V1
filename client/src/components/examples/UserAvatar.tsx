import { UserAvatar } from "../UserAvatar";

export default function UserAvatarExample() {
  return (
    <div className="p-8 flex gap-8 items-center">
      <UserAvatar name="Adi" shortName="AD" size="sm" />
      <UserAvatar name="Adi" shortName="AD" size="md" isActive />
      <UserAvatar name="Adi" shortName="AD" size="lg" />
    </div>
  );
}
