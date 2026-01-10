import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Star, Search, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminTopPerformers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [performers, setPerformers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchPerformers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/school/admin/top-performers?limit=100');
        setPerformers(response.data.students || []);
      } catch (error) {
        console.error('Error fetching top performers:', error);
        toast.error('Failed to load top performers');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformers();
  }, []);

  const filteredPerformers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return performers;
    return performers.filter((student) => {
      return (
        student.name?.toLowerCase().includes(term) ||
        String(student.grade || '').includes(term) ||
        String(student.section || '').toLowerCase().includes(term)
      );
    });
  }, [performers, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredPerformers.length / pageSize));
  const paginatedPerformers = filteredPerformers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-500" />
                Top Performers
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Ranked by overall mastery across all pillars.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, grade, section"
              className="bg-transparent outline-none text-sm text-slate-700 w-64"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
        >
          {loading ? (
            <div className="text-center py-16 text-slate-500">Loading top performers...</div>
          ) : filteredPerformers.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No performers found. Try a different search.
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedPerformers.map((student, idx) => (
                <motion.div
                  key={`${student.userId || student.name}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white font-black text-lg shadow-md">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-900 truncate">
                      {student.name || 'Student'}
                    </p>
                    <p className="text-sm text-slate-600">
                      Grade {student.grade || 'N/A'} {student.section || ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="font-black text-slate-900 text-lg">
                        {student.score ?? 0}%
                      </span>
                    </div>
                    <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      <Award className="w-3 h-3" />
                      Mastery
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {filteredPerformers.length > pageSize && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">
                Showing {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredPerformers.length)} of {filteredPerformers.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Prev
                </button>
                <span className="text-sm font-semibold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SchoolAdminTopPerformers;
