import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { AppProps } from "next/app";
import {
  DeviceContextResult,
  DeviceContextProvider,
} from "~/context/DeviceContext";
import Layout from "~/components/Layout";
import DeviceDetector from "device-detector-js";
import { DeviceType } from "device-detector-js/dist/typings/device";

import "./styles.css";

interface GlobalAppProps {
  device: DeviceContextResult;
}
export default function App({
  Component,
  pageProps,
  device,
}: AppProps & GlobalAppProps) {
  return (
    <DeviceContextProvider value={device}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DeviceContextProvider>
  );
}

const detector = new DeviceDetector();
const mobileDeviceTypes = new Set<DeviceType>([
  "tablet",
  "smartphone",
  "phablet",
]);

const getDevice = (context: GetServerSidePropsContext): DeviceContextResult => {
  const userAgent = context.req.headers["user-agent"];
  const { device } = detector.parse(userAgent);
  return {
    isMobile: mobileDeviceTypes.has(device.type),
  };
};

export const getServerSideProps: GetServerSideProps<GlobalAppProps> = async (
  context
) => ({
  props: {
    device: getDevice(context),
  },
});
