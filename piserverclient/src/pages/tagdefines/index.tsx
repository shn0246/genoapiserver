import React, { useState } from 'react';
import { 
  useCreateTagMutation, 
  useDeleteTagMutation, 
  useGetTagsQuery, 
  useUpdateTagMutation 
} from '../../api/tag';
import type { TagItem, TagCreateRequest, TagUpdateRequest } from '../../api/tag/type';

const TagDefines = () => {
  // RTK Query Hooks
  const { data: tags, isLoading, error } = useGetTagsQuery();
  const [createTag] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  // Local State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Partial<TagItem> | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTag?.Id) {
        // Update işlemi
        const updateRequest: TagUpdateRequest = {
          Id: editingTag.Id,
          tagName: editingTag.tagName || '',
          tagDisplayName: editingTag.tagDisplayName || '',
        };
        await updateTag(updateRequest).unwrap();
      } else {
        // Create işlemi
        const createRequest: TagCreateRequest = {
          tagName: editingTag?.tagName || '',
          tagDisplayName: editingTag?.tagDisplayName || '',
        };
        await createTag(createRequest).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error("İşlem sırasında hata oluştu:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu tag'i silmek istediğinize emin misiniz?")) {
      await deleteTag({ Id: id }).unwrap();
    }
  };

  const openModal = (tag: Partial<TagItem> | null = null) => {
    setEditingTag(tag || { tagName: '', tagDisplayName: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 text-red-500 bg-red-50 rounded-lg m-6 border border-red-200">
      Bağlantı hatası! Lütfen API servisinin çalıştığından emin olun.
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Bölümü */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tag Tanımlamaları</h1>
          <p className="text-gray-500 mt-1">Sistemdeki tüm veri etiketlerini buradan yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          {/* Plus Icon SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span className="font-semibold">Yeni Ekle</span>
        </button>
      </div>

      {/* Grid Liste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tags?.map((tag) => (
          <div key={tag.Id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
            <div className="mb-4">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                {tag.tagName}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mt-3 truncate">{tag.tagDisplayName}</h3>
              <p className="text-xs text-gray-400 mt-1">ID: #{tag.Id}</p>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
              <button 
                onClick={() => openModal(tag)} 
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Düzenle"
              >
                {/* Edit Icon SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button 
                onClick={() => handleDelete(tag.Id)} 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sil"
              >
                {/* Trash Icon SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL - INSERT / UPDATE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800">
                {editingTag?.Id ? 'Güncelleme' : 'Yeni Kayıt'}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tag Adı (Sistem)</label>
                <input 
                  autoFocus
                  required
                  placeholder="Örn: AI_TEMP_001"
                  className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all font-mono"
                  value={editingTag?.tagName || ''}
                  onChange={(e) => setEditingTag({...editingTag, tagName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Görünen İsim</label>
                <input 
                  required
                  placeholder="Örn: Kazan Sıcaklık Sensörü"
                  className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                  value={editingTag?.tagDisplayName || ''}
                  onChange={(e) => setEditingTag({...editingTag, tagDisplayName: e.target.value})}
                />
              </div>
              
              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center gap-2 items-center hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                  {/* Save Icon SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagDefines;