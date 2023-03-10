import { useRouter } from "next/router";
import { useAuth } from "../components/authProvider";
import { useForm } from "react-hook-form";

export default function Login() {
  const { session, loginGoogle } = useAuth();
  const router = useRouter();
  const {
    handleSubmit,
  } = useForm();

  if (session) {
    router.push("/");
  }

  const onSubmitGoogle = async () => {
    await loginGoogle().then(() =>
      router.push("/")
    );
  };

  return (
    <div>
      <h1>ログイン・サインアップ</h1>
      <form onSubmit={handleSubmit(onSubmitGoogle)}>
        <button type="submit">googleログイン</button>
      </form>
    </div>
  );
}
