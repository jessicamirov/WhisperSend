import elliptic from "elliptic";

const ec = new elliptic.ec("secp256k1");

export const generateKeyPair = () => {
  const keyPair = ec.genKeyPair();
  const publicKey = "0x" + keyPair.getPublic().encode("hex");
  const privateKey = "0x" + keyPair.getPrivate().toString("hex");
  return { publicKey, privateKey };
};
