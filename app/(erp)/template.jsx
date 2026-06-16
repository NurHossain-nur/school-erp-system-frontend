// app/(erp)/template.jsx
import PageWrapper from "@/components/layout/PageWrapper";

export default function ERPTemplate({ children }) {
  return (
    <PageWrapper>
      {children}
    </PageWrapper>
  );
}