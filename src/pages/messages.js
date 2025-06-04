import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';

function MESSAGES() {
  const { postId } = useParams(); // This is the JOB ID
  const [user, setUser] = useState(null);
  const [messageThreads, setMessageThreads] = useState([]);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Helper function to create consistent room ID
  // Each conversation should have a unique ID based on job + specific freelancer
  const createRoomId = (jobId, freelancerId) => {
    return `job_${jobId}_freelancer_${freelancerId}`;
  };
  useEffect(() => {
    const initializeMessages = async () => {
      if (!isAuthenticated()) {
        alert('Please sign in to view messages.');
        navigate('/signin');
        return;
      }

      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        // Fetch job data
        const jobsResponse = await api.get('/api/documents');
        const jobs = jobsResponse.data;
        const job = jobs.find(j => j._id === postId);

        if (!job) {
          console.error('Job not found');
          setLoading(false);
          return;
        } setJobData(job);
        console.log('Job found:', job.title, 'by', job.postedBy);
        console.log('Current user:', currentUser.username);

        // Check if user is job owner
        if (currentUser.username === job.postedBy) {
          // Job owner: fetch all message threads for this job
          const threadsResponse = await api.post('/getAllForPost', {
            postId: postId
          });

          console.log('Message threads for job owner:', threadsResponse.data);
          setMessageThreads(threadsResponse.data);
        } else {
          // Freelancer: Create room ID for this specific freelancer
          const roomId = createRoomId(postId, currentUser.id);          // Try to fetch existing conversation
          const existingConvo = await api.post('/messages1', {
            formData: roomId
          });

          console.log('Existing conversation check:', existingConvo.data);
        }

      } catch (error) {
        console.error('Error initializing messages:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeMessages();
  }, [postId]);  // Show loading state
  if (loading) {
    return (
      <div className="p-8 text-gray-800 bg-white min-h-screen">
        <h3 className="text-2xl font-semibold mb-4">Loading...</h3>
        <p className="text-gray-600">Please wait while we load your messages.</p>
      </div>
    );
  }

  // Show error if no job data
  if (!jobData) {
    return (
      <div className="p-8 text-gray-800 bg-white min-h-screen">
        <h3 className="text-2xl font-semibold mb-4 text-red-600">Job Not Found</h3>
        <p className="text-gray-600">The job you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/world')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
  }
  // ✅ JOB OWNER VIEW: Show all message threads from freelancers
  if (user && jobData && user.username === jobData.postedBy) {
    return (<div className="p-8 text-gray-800 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-2 text-gray-800">
          Messages for: {jobData.title}
        </h3>
        <p className="text-gray-600 mb-6">Conversations from freelancers interested in your job</p>

        {messageThreads.length > 0 ? (<div className="space-y-4">
          {messageThreads.map((thread, index) => {
            // Extract freelancer info from formData (format: job_${jobId}_freelancer_${freelancerId})
            const messages = Array.isArray(thread.messages) ? thread.messages : [thread.messages];
            const lastMessage = messages[messages.length - 1];

            // Extract freelancer ID from room format: job_${jobId}_freelancer_${freelancerId}
            const roomParts = thread.formData.split('_');
            const freelancerId = roomParts.length >= 4 ? roomParts[3] : 'Unknown';

            // Get freelancer username from messages (more reliable than ID)
            const freelancerUsername = messages.find(msg => msg.sender !== jobData.postedBy)?.sender || `Freelancer (${freelancerId})`;

            return (<div
              key={index}
              onClick={() => navigate(`/chat/${thread.formData}`)}
              className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-400 shadow-sm"
            >              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg text-blue-600 flex items-center gap-2">
                  <span className="text-lg" role="img" aria-label="Chat">💬</span>
                  {freelancerUsername}
                </h4>
                <span className="text-xs text-gray-500">
                  {lastMessage?.timestamp ? new Date(lastMessage.timestamp).toLocaleString() : ''}
                </span>
              </div>

              <p className="text-gray-700 mb-2">
                <span className="font-medium">{lastMessage?.sender}:</span>{' '}
                {lastMessage?.text || "No messages yet"}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
                <span className="text-blue-600">Click to chat →</span>
              </div>
            </div>
            );
          })}        </div>) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4" role="img" aria-label="Empty mailbox">📭</div>
            <p className="text-xl text-gray-700 mb-2">No messages yet for this job</p>
            <p className="text-gray-500">Freelancers will be able to message you about this job</p>
          </div>
        )}
      </div>
    </div>
    );
  }
  // ✅ FREELANCER VIEW: Start conversation with job owner
  return (
    <div className="p-8 text-gray-800 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto text-center">        <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3 justify-center">
        <span className="text-3xl" role="img" aria-label="Job">💼</span>
        Interested in this job?
      </h3>

        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm mb-6">
          <h4 className="text-xl font-semibold mb-4 text-blue-600">Job Details</h4>
          <p className="text-gray-700 mb-2"><span className="font-medium">Title:</span> {jobData.title}</p>
          <p className="text-gray-700 mb-2"><span className="font-medium">Category:</span> {jobData.category}</p>
          <p className="text-gray-700 mb-2"><span className="font-medium">Posted by:</span> {jobData.postedBy}</p>
          <p className="text-gray-700"><span className="font-medium">Status:</span> {jobData.status}</p>
        </div>        <button
          onClick={() => {
            const roomId = createRoomId(postId, user.id);
            navigate(`/chat/${roomId}`, {
              state: {
                jobData,
                isFreelancer: true,
                roomId
              }
            });
          }} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-lg flex items-center gap-3 justify-center"
        >
          <span className="text-lg" role="img" aria-label="Chat">💬</span>
          Start Conversation with {jobData.postedBy}
        </button>

        <p className="text-gray-500 mt-4 text-sm">
          Click to start discussing this opportunity
        </p>
      </div>
    </div>
  );
}

export default MESSAGES;
