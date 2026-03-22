import { Link } from 'react-router-dom'
import './RegisterRequiredModal.css'

export default function RegisterRequiredModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title" className="modal-title">需要注册为会员才能查看</h2>
        <p className="modal-desc">请先注册或登录后访问该模块内容。</p>
        <div className="modal-actions">
          <Link to="/register" className="btn-modal btn-register" onClick={onClose}>
            注册
          </Link>
          <Link to="/login" className="btn-modal btn-login" onClick={onClose}>
            登录
          </Link>
        </div>
        <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
          ×
        </button>
      </div>
    </div>
  )
}
