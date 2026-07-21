import type { FormEvent } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AdminHeader } from './components/AdminHeader'
import { BlogFormPage } from './pages/BlogFormPage'
import { BlogPage } from './pages/BlogPage'
import { ComplaintDetailPage } from './pages/ComplaintDetailPage'
import { ComplaintPage } from './pages/ComplaintPage'
import { LinkPayFormPage } from './pages/LinkPayFormPage'
import { LinkPayPage } from './pages/LinkPayPage'
import { NoticeFormPage } from './pages/NoticeFormPage'
import { NoticePage } from './pages/NoticePage'
import { PortfolioFormPage } from './pages/PortfolioFormPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ProductFormPage } from './pages/ProductFormPage'
import { ProductPage } from './pages/ProductPage'
import { ReviewFormPage } from './pages/ReviewFormPage'
import { ReviewPage } from './pages/ReviewPage'
import { SalesPage } from './pages/SalesPage'
import './App.css'

function scrollToFirstInvalidControl(event: FormEvent<HTMLElement>) {
  const control = event.target

  if (
    !(
      control instanceof HTMLInputElement ||
      control instanceof HTMLSelectElement ||
      control instanceof HTMLTextAreaElement
    )
  )
    return

  const firstInvalidControl = control.form?.querySelector(
    'input:invalid, select:invalid, textarea:invalid',
  )

  if (firstInvalidControl !== control) return

  const scrollTarget =
    control.type === 'checkbox' || control.type === 'radio'
      ? (control.closest('label') ?? control)
      : control

  window.requestAnimationFrame(() => {
    scrollTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
  })
}

export function App() {
  return (
    <div className="admin-shell" onInvalidCapture={scrollToFirstInvalidControl}>
      <AdminHeader />
      <Routes>
        <Route element={<Navigate replace to="/products" />} path="/" />
        <Route element={<ProductPage />} path="/products" />
        <Route element={<ProductFormPage />} path="/products/new" />
        <Route element={<ProductFormPage />} path="/products/:productId" />
        <Route element={<PortfolioPage />} path="/portfolio" />
        <Route element={<PortfolioFormPage />} path="/portfolio/new" />
        <Route element={<PortfolioFormPage />} path="/portfolio/:portfolioId" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<BlogFormPage />} path="/blog/new" />
        <Route element={<BlogFormPage />} path="/blog/:blogId" />
        <Route element={<ReviewPage />} path="/reviews" />
        <Route element={<ReviewFormPage />} path="/reviews/new" />
        <Route element={<ReviewFormPage />} path="/reviews/:reviewId" />
        <Route element={<NoticePage />} path="/notices" />
        <Route element={<NoticeFormPage />} path="/notices/new" />
        <Route element={<NoticeFormPage />} path="/notices/:noticeId" />
        <Route element={<ComplaintPage />} path="/complaints" />
        <Route element={<ComplaintDetailPage />} path="/complaints/:complaintId" />
        <Route element={<LinkPayPage />} path="/linkpay" />
        <Route element={<LinkPayFormPage />} path="/linkpay/new" />
        <Route element={<SalesPage />} path="/sales" />
      </Routes>
      <Toaster />
    </div>
  )
}
